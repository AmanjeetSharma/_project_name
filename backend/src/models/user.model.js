import mongoose, { Schema } from "mongoose";

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  device: { type: String, default: 'Unknown Device' },
  refreshToken: String,
  firstLogin: { type: Date, default: Date.now },
  latestLogin: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const addressSchema = new Schema(
  {
    city: { type: String, trim: true, default: null },
    state: { type: String, trim: true, default: null },
    country: { type: String, trim: true, default: null },
    zipCode: { type: String, trim: true, default: null },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Name must be at least 3 characters long'],
      maxlength: [30, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },



    resetPasswordToken: {
      type: String,
      default: null
    },
    resetPasswordExpiry: {
      type: Date,
      default: null
    },


    sessions: [sessionSchema],
    address: addressSchema,
  }
);

export const User = 
    mongoose.models.User || mongoose.model("User", userSchema);