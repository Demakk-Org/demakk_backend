import mongoose from "mongoose";
import { Image } from "./imageSchema";
import Discount from "./discountSchema";
import DealType from "./dealTypeSchema";

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
  image: {
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

const Deal = mongoose.Model("Deal", DealSchema);

export default Deal;
