import mongoose from "mongoose";
import { StockItem } from "./stockItemSchema.js";

const { Schema } = mongoose;

const ProductCategorySchema = Schema(
  {
    stockItem: {
      type: mongoose.Types.ObjectId,
      ref: "StockItem",
      required: true,
    },
    name: {
      type: Map,
      of: String,
      required: true,
    },
    additionalPrice: {
      type: Number,
      required: true,
    },
    additionalCost: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      updatedAt: "updatedAt",
      createdAt: "createdAt",
    },
  }
);

const ProductCategory = mongoose.model(
  "ProductCategory",
  ProductCategorySchema
);

export { ProductCategory };
