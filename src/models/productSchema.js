import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductSchema = Schema(
  {
    name: {
      type: Map,
      of: String,
      required: true,
    },
    description: {
      type: Map,
      of: String,
      required: true,
    },
    productCategory: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "ProductCategory",
    },
    tags: [
      {
        type: String,
        lowercase: true,
      },
    ],
    price: Number,
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const Product = mongoose.model("Product", ProductSchema);

export { Product };
