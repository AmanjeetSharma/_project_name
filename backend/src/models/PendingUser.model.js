import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        verificationToken: String,
        verificationTokenExpiry: Date
    },
    { timestamps: true }
);

// TTL → auto delete after 1 hour
pendingUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });

export const PendingUser =
    mongoose.models.PendingUser || mongoose.model("PendingUser", pendingUserSchema);