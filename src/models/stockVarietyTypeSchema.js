import mongoose from "mongoose";

const { Schema } = mongoose;

const StockVarietyTypeSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      value: "Main" | "Sub",
      required: true,
      default: "Sub",
    },
  },

  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const StockVarietyType = mongoose.model(
  "StockVarietyType",
  StockVarietyTypeSchema
);
