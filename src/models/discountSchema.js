import mongoose from "mongoose";
import DiscountType from "./discountTypeSchema";
import { Product } from "./productSchema";

const { Schema } = mongoose;

const DiscountSchema = new Schema(
  {
    discountType: {
      type: mongoose.Types.ObjectId,
      ref: "DiscountType",
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
      enum: ["active", "closed", "pending"],
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

const Discount = mongoose.Model("Discount", DiscountSchema);

export default Discount;
