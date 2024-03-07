import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import Order from "../../models/orderSchema.js";
import OrderStatus from "../../models/orderStatusSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import response from "../../../response.js";
import { camelize } from "../../utils/validate.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const updateOrder = async (req, res) => {
  let { orderId, status, lang } = req.body;
  let uid = req.uid;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!orderId || !status) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(orderId)) {
    return ErrorHandler(res, 464, lang);
  }

  const orderStatus = await OrderStatus.findOne({ name: camelize(status) });

  console.log(orderStatus && true);

  if (!orderStatus) {
    return ErrorHandler(res, 470, lang);
  }

  try {
    Order.findById(orderId).then(async (order) => {
      if (!order) {
        return ErrorHandler(res, 471, lang);
      }

      if (order.user.toString() !== uid) {
        return ErrorHandler(res, 472, lang);
      }

      order.orderStatus = orderStatus._id;
      await order.save();

      return ErrorHandler(res, 203, lang);
    });
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
