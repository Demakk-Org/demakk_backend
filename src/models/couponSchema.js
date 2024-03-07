import mongoose from "mongoose";
import DiscountType from "./discountTypeSchema.js";

const { Schema } = mongoose;
export const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    discountTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiscountType",
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    appliesToProductCategory: [
      {
        type: mongoose.Types.ObjectId,
        ref: "ProductCategory",
        required: true,
      },
    ],
    endsAt: Date,
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt", // and `updated_at` to store the last updated date
    },
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
