import mongoose from "mongoose";

const { Schema } = mongoose;

export const orderItemSchema = new Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unitPrice: {
    type: Number,
    required: true
  },
  couponCode: String,
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
});
const OrderItem = mongoose.model("OrderItem", orderItemSchema);

export default OrderItem;
/*const  = mongoose.model('OrderItem', orderItemSchema);

module.exports = OrderItem;




const OrderItem = {
  name: "OrderItem",
  properties: {
    _id: { type: "objectId!", mapTo: "id" },
    order: "objectId!", //from the order it is in
    quantity: "int!",
    unitPrice: "int!",
    couponCode: "objectId?",// refs to the coupon
    createdAt: {
      type: "date!",
      default: () => new Date(),
    },
  },
  primaryKey: "_id",
}*/