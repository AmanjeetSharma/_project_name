import mongoose, { Schema } from "mongoose";

const testQuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },

    userAnswer: { type: String, default: null },
    isCorrect: { type: Boolean, default: false }
  },
  { _id: false }
);

const testSectionSchema = new Schema(
  {
    sectionName: { type: String, required: true },
    questions: [testQuestionSchema]
  },
  { _id: false }
);

const testSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    userEmail: {  // For easier querying and display
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["in-progress", "submitted"],
      default: "in-progress"
    },

    sections: [testSectionSchema],

    submittedAt: Date,

    startedAt: {
      type: Date,
      default: Date.now
    },
    timeRemaining: {
      type: Number, 
    }
  },
  { timestamps: true }
);

export const Test
  = mongoose.models.Test || mongoose.model("Test", testSchema);