import { Test } from "../models/test.model.js";
import { generateFinanceQuery } from "../service/gemini.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Result } from "../models/result.model.js";
import { set } from "mongoose";











const generateTest = asyncHandler(async (req, res) => {
  const { studentClass, interest } = req.body;

  if (!studentClass || !interest || (Array.isArray(interest) && interest.length === 0)) {
    throw new ApiError(400, "studentClass and at least one interest are required");
  }

  const existingTest = await Test.findOne({
    userId: req.user._id,
    status: "in-progress"
  });

  if (existingTest) {
    throw new ApiError(400, "You already have a test in progress. Please submit or wait for it to expire before generating a new one.");
  }


  await new Promise(r => setTimeout(r, 10000));
  return;// temporary to avoid hitting gemini limits during development

  // generating test using gemini
  const aiResponse = await generateFinanceQuery({ studentClass, interest });

  if (!aiResponse?.sections || aiResponse.sections.length === 0) {
    throw new ApiError(500, "Failed to generate test from AI");
  }

  const sections = aiResponse.sections.map(section => ({
    sectionName: section.section_name,
    questions: section.questions.map(q => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.answer,
      userAnswer: null,
      isCorrect: false
    }))
  }));

  const test = await Test.create({
    userId: req.user._id,
    userEmail: req.user.email,
    sections,
    status: "in-progress",
    startedAt: new Date(),
    timeRemaining: 3600 // 1 hour in seconds
  });

  console.log("Test generated with ID:", test._id);

  return res.status(201).json(
    new ApiResponse(201, test, "Test generated successfully")
  );
});














const submitTest = asyncHandler(async (req, res) => {
  const { testId, answers } = req.body;

  if (!testId || !Array.isArray(answers)) {
    throw new ApiError(400, "testId and answers are required");
  }

  const test = await Test.findById(testId);

  if (!test) {
    throw new ApiError(404, "Test not found");
  }

  // to prevent cheating, only allow submission if test is in-progress
  if (test.status === "submitted") {
    throw new ApiError(400, "Test already submitted");
  }

  let totalCorrect = 0;
  let totalQuestions = 0;

  const sectionScores = {
    quantitative: 0,
    logical: 0,
    verbal: 0,
    creative: 0,
    technical: 0
  };

  test.sections.forEach(section => {
    const submittedSection = answers.find(
      s => s.sectionName === section.sectionName
    );

    if (!submittedSection) return;

    let sectionCorrect = 0;

    section.questions.forEach((q, index) => {
      const userQ = submittedSection.questions[index];

      if (!userQ) return;

      q.userAnswer = userQ.userAnswer || null;

      if (q.userAnswer === q.correctAnswer) {
        q.isCorrect = true;
        sectionCorrect++;
        totalCorrect++;
      } else {
        q.isCorrect = false;
      }

      totalQuestions++;
    });

    const sectionScore =
      section.questions.length > 0
        ? Math.round((sectionCorrect / section.questions.length) * 100)
        : 0;

    const key = section.sectionName.toLowerCase();

    if (key.includes("quant")) sectionScores.quantitative = sectionScore;
    else if (key.includes("logical")) sectionScores.logical = sectionScore;
    else if (key.includes("verbal")) sectionScores.verbal = sectionScore;
    else if (key.includes("creative")) sectionScores.creative = sectionScore;
    else if (key.includes("technical")) sectionScores.technical = sectionScore;
  });

  const aggregate =
    totalQuestions > 0
      ? Math.round((totalCorrect / totalQuestions) * 100)
      : 0;

  // updating test status and answers
  test.status = "submitted";
  test.submittedAt = new Date();

  await test.save();

  const result = await Result.create({
    userId: test.userId,
    testId: test._id,
    scores: {
      ...sectionScores,
      aggregate
    }
  });

  console.log("Test submitted with ID:", test._id, "Result created with ID:", result._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        resultId: result._id,
        scores: result.scores
      },
      "Test submitted and evaluated successfully"
    )
  );
});












const getRunningTest = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const test = await Test.findOne({
    userId,
    status: "in-progress"
  }).sort({ createdAt: -1 });

  if (!test) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "No running test found"));
  }

  const now = Date.now();
  const startedAt = new Date(test.startedAt).getTime();

  const elapsed = Math.floor((now - startedAt) / 1000); // seconds
  const remainingTime = test.totalTime - elapsed;

  console.log("On-going test fetched:", test._id, "Remaining:", remainingTime);

  // time over
  if (remainingTime <= 0) {
    test.status = "submitted";
    test.submittedAt = new Date();

    await test.save();

    // auto-submit on expiry or left abandoned
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          expired: true,
          testId: test._id
        },
        "Test time expired"
      )
    );
  }

  // complete test object with remaining time
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...test.toObject(),
        remainingTime // current remaining time in seconds
      },
      "Running test fetched successfully"
    )
  );
});









const getTestById = asyncHandler(async (req, res) => {
  const { testId } = req.params;

  if (!testId) {
    throw new ApiError(400, "testId is required");
  }

  const test = await Test.findById(testId);

  if (!test) {
    throw new ApiError(404, "Test not found");
  }

  if (test.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized access");
  }

  // Block if still running
  if (test.status === "in-progress") {
    throw new ApiError(400, "Test is still in progress");
  }

  const result = await Result.findOne({ testId });

  console.log("Test fetched:", test._id, "Result fetched:", result?._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        test,
        result
      },
      "Test result fetched successfully"
    )
  );
});









const getUserAllTests = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const tests = await Test.find({ userId })
    .sort({ createdAt: -1 }) // latest first for recent tests
    .select("_id status createdAt submittedAt");

  const results = await Result.find({ userId }).select("testId scores");

  const resultMap = {};
  results.forEach(r => {
    resultMap[r.testId.toString()] = r.scores;
  });

  const response = tests.map(test => ({
    testId: test._id,
    status: test.status,
    createdAt: test.createdAt,
    submittedAt: test.submittedAt,
    scores: resultMap[test._id.toString()] || null
  }));

  console.log("User tests fetched:", response.length);

  return res.status(200).json(
    new ApiResponse(200, response, "User tests fetched successfully")
  );
});









export {
  generateTest,
  submitTest,
  getRunningTest,
  getTestById,
  getUserAllTests
}
