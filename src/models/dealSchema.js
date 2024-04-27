import mongoose from "mongoose";
import { Image } from "./imageSchema.js";
import Discount, { statusEnum } from "./discountSchema.js";
import DealType from "./dealTypeSchema.js";

const { Schema } = mongoose;

const DealSchema = new Schema({
  dealType: {
    type: mongoose.Types.ObjectId,
    ref: "DealType",
  },
  images: {
    type: mongoose.Types.ObjectId,
    ref: "Image",
  },
  discounts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Discount",
    },
  ],
  status: {
    type: String,
    enum: statusEnum,
    default: "pending",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const Deal = mongoose.model("Deal", DealSchema);

export default Deal;
