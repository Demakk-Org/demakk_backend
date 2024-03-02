import mongoose from "mongoose";
import { StockVarietyType } from "./stockVarietyTypeSchema.js";

const { Schema } = mongoose;

const StockVarietySchema = new Schema(
  {
    value: String,
    stockVariety: {
      type: mongoose.Types.ObjectId,
      ref: "StockVarietyType",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const StockVariety = mongoose.model("StockVariety", StockVarietySchema);
