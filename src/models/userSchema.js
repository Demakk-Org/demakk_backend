import { mongoose } from "mongoose";
import Role from "./roleSchema.js";

const { Schema } = mongoose;

export const UserSchema = new Schema(
  {
    email: {
      type: String,
      // unique: true,
      lowercase: true,
      default: "",
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneNumber: {
      type: String,
      default: "",
      // unique: true,
    },
    phoneNumberVerified: {
      type: Boolean,
      default: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    billingAddress: {
      type: mongoose.Types.ObjectId,
      ref: "Address",
    },
    shippingAddress: {
      type: mongoose.Types.ObjectId,
      ref: "Address",
    },
    cart: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Order",
      },
    ],
    lang: {
      type: String,
      default: "en",
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: {
      updatedAt: "updatedAt", // and `updated_at` to store the last updated date
    },
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
