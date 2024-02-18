import { mongoose } from "mongoose";
import Role from "./roleSchema.js";

const { Schema } = mongoose;

export const UserSchema = new Schema(
  {
    email: {
      type: String,
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
    image: String,
    searchTerms: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: {
      updatedAt: "updatedAt",
      createdAt: "createdAt",
    },
  }
);

const User = mongoose.model("User", UserSchema);

export default User;
