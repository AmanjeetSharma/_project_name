import mongoose, { Schema } from "mongoose";

const resultSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        testId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Test",
            required: true
        },

        scores: {
            quantitative: Number,
            logical: Number,
            verbal: Number,
            creative: Number,
            technical: Number,
            aggregate: Number
        },

    },
    { timestamps: true }
);

export const Result
    = mongoose.models.Result || mongoose.model("Result", resultSchema);