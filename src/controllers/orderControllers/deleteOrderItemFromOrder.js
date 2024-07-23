import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { isValidObjectId } from "mongoose";
import Order from "../../models/orderSchema.js";
import OrderItem from "../../models/orderItemSchema.js";

const { LANG } = config(process.cwd, ".env").parsed;

const deleteOrderItem = async (req, res) => {
  let { lang, orderItemId, orderId } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!orderItemId || !orderId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(orderItemId)) {
    return ResponseHandler(res, "orderItem", 402, lang);
  }

  if (!isValidObjectId(orderId)) {
    return ResponseHandler(res, "order", 402, lang);
  }

  try {
    const order = await Order.findById(orderId).populate("orderItems");

    if (!order) {
      return ResponseHandler(res, "order", 404, lang);
    }

    let promises = [];

    let orderItem = await OrderItem.findById(orderItemId);

    if (orderItem.isActive) {
      orderItem.isActive = false;
      promises.push(orderItem.save());
    } else {
      promises.push(orderItem.deleteOne());
    }

    if (
      order.orderItems.filter((oi) => oi._id.toString != orderItemId).length ==
        0 &&
      orderItem.isActive == false
    ) {
      promises.push(order.deleteOne());
    }

    Promise.all(promises)
      .then((response) => {
        console.log(response);
        return ResponseHandler(res, "common", 203, lang);
      })
      .catch((err) => {
        console.log(err);
        return ResponseHandler(res, "common", 500, lang);
      });
  } catch (error) {
    console.log(error);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default deleteOrderItem;
