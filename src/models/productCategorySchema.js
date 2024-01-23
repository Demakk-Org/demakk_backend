import mongoose from "mongoose";

const { Schema } = mongoose;

const ProductCategorySchema = Schema(
  {
    stockItem: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    additionalPrice: Number,
    additionalCost: Number,
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: {
      updatedAt: "updatedAt",
    },
  }
);

const ProductCategory = mongoose.model(
  "ProductCategory",
  ProductCategorySchema
);

export default ProductCategory;
