import mongoose from "mongoose";
import Coupon from "./couponSchema.js";

const { Schema } = mongoose;

export const orderItemSchema = new Schema(
  {
    orderId: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitPrice: {
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
