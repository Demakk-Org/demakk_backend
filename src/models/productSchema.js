import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    productCategory: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: {
      updatedAt: "updatedAt", // and `updated_at` to store the last updated date
    },
  }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
