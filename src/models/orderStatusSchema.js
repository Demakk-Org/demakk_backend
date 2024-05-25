import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderStatusSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  orderIndex: {
    type: Number,
    required: true,
    unique: true,
  },
});

const OrderStatus = mongoose.model("OrderStatus", OrderStatusSchema);

export default OrderStatus;
