import mongoose from "mongoose";

const { Schema } = mongoose;

const StockVarietyTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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
