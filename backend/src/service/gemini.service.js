// services/geminiLLMService.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildTestPrompt } from "../prompts/buildTestPrompt.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateFinanceQuery = async ({ studentClass, interest }) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview"
  });

  // interest can be array or string
  const prompt = buildTestPrompt(studentClass, interest);

  const maxRetries = 3;
  let attempt = 0;
  let lastError = null;
  while (attempt < maxRetries) {
    try {
      const result = await model.generateContent(prompt);
      return JSON.parse(result.response.text());
    } catch (error) {
      // Check for 503 error
      if (
        error &&
        error.message &&
        error.message.includes("503 Service Unavailable")
      ) {
        attempt++;
        lastError = error;
        // Exponential backoff: 1s, 2s, 4s
        await new Promise((res) => setTimeout(res, 1000 * Math.pow(2, attempt - 1)));
      } else {
        // Other errors, rethrow
        throw error;
      }
    }
  }
  // If all retries failed, return a user-friendly error
  throw new Error(
    "The AI service is currently experiencing high demand. Please try again in a few moments."
  );
};