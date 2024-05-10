import mongoose from "mongoose";
import Coupon from "./couponSchema.js";
import { ProductVariant } from "./productVariantSchema.js";

const { Schema } = mongoose;

export const orderItemSchema = new Schema(
  {
    productVariant: {
      type: mongoose.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    couponCode: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
    },
  }
);

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

export default OrderItem;
