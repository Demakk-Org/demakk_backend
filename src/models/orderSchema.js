import mongoose from "mongoose";
import OrderStatus from "./orderStatusSchema.js";
import User from "./userSchema.js";

const { Schema } = mongoose;

const OrderSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  orderItems: [
    {
      type: mongoose.Types.ObjectId,
      ref: "OrderItem",
    },
  ],
  orderDate: {
    type: Date,
    required: true,
  },
  deliveryDate: Date,
  orderStatus: {
    type: mongoose.Types.ObjectId,
    ref: "OrderStatus",
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Order = mongoose.model("Order", OrderSchema);

export default Order;
