import mongoose from "mongoose";
import { StockVarietyType } from "./stockVarietyTypeSchema.js";
import { Image } from "./imageSchema.js";
import { Product } from "./productSchema.js";

const { Schema } = mongoose;

const StockVarietySchema = new Schema(
  {
    value: String,
    stockVarietyType: {
      type: mongoose.Types.ObjectId,
      ref: "StockVarietyType",
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    image: String,
    type: {
      type: String,
      enum: ["main", "sub"],
      default: "main",
    },
    subVariants: [
      {
        type: mongoose.Types.ObjectId,
        ref: "StockVariety",
      },
    ],
    price: Number,
    numberOfAvailable: Number,
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const StockVariety = mongoose.model("StockVariety", StockVarietySchema);
