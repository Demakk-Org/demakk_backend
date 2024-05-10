import mongoose from "mongoose";
import { StockVarietyType } from "./stockVarietyTypeSchema.js";
import { Product } from "./productSchema.js";

const { Schema } = mongoose;

const productVariantSchema = new Schema(
  {
    stockVarieties: [
      {
        type: { type: mongoose.Types.ObjectId, ref: "StockVarietyType" },
        value: { type: String, required: true },
        class: {
          type: String,
          enum: ["Main", "Sub"],
          required: true,
        },
      },
    ],
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    imageIndex: { type: Number, default: 0 },
    additionalPrice: { type: Number, default: 0 },
    numberOfAvailable: { type: Number, required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const ProductVariant = mongoose.model(
  "ProductVariant",
  productVariantSchema
);
