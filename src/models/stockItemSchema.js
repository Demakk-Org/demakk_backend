import mongoose from "mongoose";

const { Schema } = mongoose;

const stockItemSchema = new Schema(
  {
    stockType: {
      type: mongoose.Types.ObjectId,
      ref: "StockType",
      required: true,
    },
    name: {
      type: Map,
      of: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    costToProduce: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const StockItem = mongoose.model("StockItem", stockItemSchema);

export default StockItem;
