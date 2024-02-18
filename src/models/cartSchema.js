import { mongoose } from "mongoose";
import Order from "./orderSchema.js";

const { Schema } = mongoose;

const CartSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
    },
    orderItems: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: {
      updatedAt: "updatedAt",
    },
  }
);

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
