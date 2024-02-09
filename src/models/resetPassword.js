import mongoose from "mongoose";

const { Schema } = mongoose;

const reserPasswordSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    // requestedAt: {
    //   type: Date,
    //   default: Date.now(),
    //   immutable: true,
    // },
    status: {
      type: String,
      enums: ["pending", "complete"],
      default: "pending",
    },
    expiresIn: Number,
  },
  {
    timestamps: {
      createdAt: "requestedAt",
    },
  }
);

const ResetPassword = mongoose.model("ResetPassword", reserPasswordSchema);

export default ResetPassword;
