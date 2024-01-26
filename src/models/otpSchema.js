import mongoose from "mongoose";

const { Schema } = mongoose;

const otpSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  account: {
    type: String,
    required: true,
  },
  expiresIn: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enums: ["pending", "complete"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
