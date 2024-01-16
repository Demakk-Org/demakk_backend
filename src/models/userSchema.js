import mongoose from "mongoose";

const { Schema } = mongoose;

export const User = new Schema({
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: Role,
    ref: mongoose.Types.ObjectId,
  },
  billingAddress: {
    type: BillingAddress,
    ref: mongoose.Types.ObjectId,
  },
  shippingAddress: {
    type: ShippingAddress,
    ref: mongoose.Types.ObjectId,
  },
  cart: {
    type: Cart,
    ref: mongoose.Types.ObjectId,
  },
  orders: {
    type: [Order],
    ref: mongoose.Types.ObjectId,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});
