import { mongoose } from "mongoose";

const { Schema } = mongoose;

export const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
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
  // role: {
  //   type: mongoose.Types.ObjectId,
  //   ref: "Role",
  // },
  // billingAddress: {
  //   type: mongoose.Types.ObjectId,
  //   ref: "Address",
  //   required:false
  // },
  // shippingAddress: {
  //   type: mongoose.Types.ObjectId,
  //   ref: "Address",
  //   required:false
  // },
  // cart: {
  //   type: mongoose.Types.ObjectId,
  //   ref: "Cart",
  // },
  // orders: {
  //   type: ["Order"],
  //   ref: mongoose.Types.ObjectId,
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // updatedAt: Date,
});

// const User = mongoose.model("User", UserSchema);

// export default User;