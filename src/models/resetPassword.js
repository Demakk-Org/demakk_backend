import mongoose from "mongoose";

const { Schema } = mongoose;

const reserPasswordSchema = new Schema({
  id: String,
  requestedAt: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enums: ["pending", "complete"],
    default: "pending",
  },
  expiresIn: Number,
});

const ResetPassword = mongoose.model("ResetPassword", reserPasswordSchema);

export default ResetPassword;
