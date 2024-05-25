import { mongoose } from "mongoose";
import Role from "./roleSchema.js";
import { Image } from "./imageSchema.js";

const { Schema } = mongoose;

export const UserSchema = new Schema(
  {
    firebaseId: {
      type: String,
      required: true,
    },
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
    },
    lastName: {
      type: String,
    },
    password: {
      type: String,
      required: false,
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
    image: {
      type: mongoose.Types.ObjectId,
      ref: "Image",
    },
    searchTerms: [
      {
        type: String,
      },
    ],
    views: [
      {
        pid: {
          type: String,
          ref: "Product",
        },
        count: {
          type: Number,
          default: 1,
        },
      },
    ],
    favs: [
      {
        type: String,
        ref: "Product",
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
