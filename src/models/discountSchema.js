import mongoose from "mongoose";
import DiscountType from "./discountTypeSchema.js";
import { Product } from "./productSchema.js";

const { Schema } = mongoose;

export const statusEnum = ["active", "closed", "pending"];

const DiscountSchema = new Schema(
  {
    discountType: {
      type: mongoose.Types.ObjectId,
      ref: "DiscountType",
      required: true,
    },
    deal: {
      type: mongoose.Types.ObjectId,
      ref: "Deal",
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    status: {
      type: String,
      enum: statusEnum,
      default: "pending",
    },
    aboveAmount: Number,
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const Discount = mongoose.model("Discount", DiscountSchema);

export default Discount;
