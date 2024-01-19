import { mongoose } from "mongoose";
import Role from "./roleSchema.js";
import Address from "./addressSchema.js"

const { Schema } = mongoose;

export const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
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
  password: {
    type: String,
    required: true,
  },
  role: {
    type: mongoose.Types.ObjectId,
    ref: 'Role',
  },
  billingAddress: {
    type: mongoose.Types.ObjectId,
    ref: 'Address',
  },
  shippingAddress: {
    type: mongoose.Types.ObjectId,
    ref: 'Address',
  },
  cart: {
    type: mongoose.Types.ObjectId,
    ref: 'Cart',
  },
  orders: [{
    type: mongoose.Types.ObjectId,
    ref: 'Order',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

const User = mongoose.model("User", UserSchema);

export default User;