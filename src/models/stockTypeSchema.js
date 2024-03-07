import mongoose from "mongoose";
import { Image } from "./imageSchema.js";
import { StockVariety } from "./stockVarietySchema.js";

const { Schema } = mongoose;

const StockTypeSchema = new Schema({
  name: {
    type: Map,
    of: String,
    required: true,
  },
  images: {
    type: mongoose.Types.ObjectId,
    ref: "Image",
  },
  availableVarieties: [
    {
      type: mongoose.Types.ObjectId,
      ref: "StockVariety",
    },
  ],
});

export const StockType = mongoose.model("StockType", StockTypeSchema);
