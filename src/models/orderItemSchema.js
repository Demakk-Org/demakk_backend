import mongoose from "mongoose";

const { Schema } = mongoose;

export const orderItemSchema = new Schema({
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
  couponCode: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

export default OrderItem;
