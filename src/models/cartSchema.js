import { mongoose } from "mongoose";
import Order from "./orderSchema.js";

const { Schema } = mongoose;

const CartSchema = new Schema(
  {
    orderItems: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  {
    timestamps: {
      updatedAt: "updatedAt", // and `updated_at` to store the last updated date
    },
  }
);

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
