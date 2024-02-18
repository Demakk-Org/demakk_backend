import mongoose from "mongoose";
import { Review } from "./reviewSchema.js";

const { Schema } = mongoose;

const ProductSchema = Schema(
  {
    name: {
      type: Map,
      of: String,
      required: true,
    },
    description: {
      type: Map,
      of: String,
      required: true,
    },
    productCategory: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "ProductCategory",
    },
    tags: [
      {
        type: String,
        lowercase: true,
      },
    ],
    price: Number,
    images: [
      {
        type: String,
      },
    ],
    ratings: {
      count: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      average: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 0,
      },
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const Product = mongoose.model("Product", ProductSchema);

export { Product };
