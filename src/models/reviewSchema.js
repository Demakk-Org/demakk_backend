import mongoose from "mongoose";
import { Product } from "./productSchema.js";
import User from "./userSchema.js";

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    text: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const Review = mongoose.model("Review", reviewSchema);
