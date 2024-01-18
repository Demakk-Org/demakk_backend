import { mongoose } from "mongoose";
import Order from "./orderSchema.js";

const { Schema } = mongoose;

const CartSchema = new Schema({
  orderItems: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Order",
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
