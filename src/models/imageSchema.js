import mongoose, { Schema } from "mongoose";
import { Product } from "./productSchema.js";

const ImageSchema = new Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    description: String,
    images: [
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

const Image = mongoose.model("Image", ImageSchema);

export default Image;
