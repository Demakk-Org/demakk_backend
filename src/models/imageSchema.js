import mongoose, { Schema } from "mongoose";
import { Product } from "./productSchema.js";

const ImageSchema = new Schema(
  {
    rid: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["product", "category", "user", "deal", "discount"],
      default: "product",
    },
    name: String,
    description: String,
    imageUrls: [
      {
        type: String,
      },
    ],
    primary: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      updatedAt: "updatedAt",
      createdAt: "createdAt",
    },
  }
);

export const Image = mongoose.model("Image", ImageSchema);
