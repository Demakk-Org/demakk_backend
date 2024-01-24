import mongoose from "mongoose";
import StockItem from "./stockItemSchema.js";

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
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: {
      updatedAt: "updatedAt",
    },
  }
);

const ProductCategory = mongoose.model(
  "ProductCategory",
  ProductCategorySchema
);

export default ProductCategory;
