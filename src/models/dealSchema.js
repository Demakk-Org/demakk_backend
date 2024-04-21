import mongoose from "mongoose";
import { Image } from "./imageSchema.js";
import Discount from "./discountSchema.js";
import DealType from "./dealTypeSchema.js";

const { Schema } = mongoose;

const DealSchema = new Schema({
  dealType: {
    type: mongoose.Types.ObjectId,
    ref: "DealType",
  },
  subTitle: {
    type: String,
    required: true,
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
