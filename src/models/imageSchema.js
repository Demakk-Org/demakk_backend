import mongoose, { Schema } from "mongoose";

import { Product } from "./productSchema.js";
import User from "./userSchema.js";
import { ProductCategory } from "./productCategorySchema.js";
import Discount from "./discountSchema.js";
import Deal from "./dealSchema.js";

const ImageSchema = new Schema(
  {
    product: { type: mongoose.Types.ObjectId, ref: "Product" },
    productCategory: { type: mongoose.Types.ObjectId, ref: "ProductCategory" },
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    deal: { type: mongoose.Types.ObjectId, ref: "Deal" },
    discount: { type: mongoose.Types.ObjectId, ref: "Discount" },

    rid: {
      type: mongoose.Types.ObjectId,
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
