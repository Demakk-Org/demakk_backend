import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderStatusSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const OrderStatus = mongoose.model("OrderStatus", OrderStatusSchema);

export default OrderStatus;
