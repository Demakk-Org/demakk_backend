import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import OrderItem from "../../models/orderItemSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const UpdateOrderItem = async (req, res) => {
  let { orderItemId, quantity, couponCode, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!orderItemId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(orderItemId)) {
    return ResponseHandler(res, "orderItem", 402, lang);
  }

  if (!quantity && !couponCode) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (couponCode && !isValidObjectId(couponCode)) {
    return ResponseHandler(res, "coupon", 402, lang);
  }

  if (quantity && (typeof quantity != "number" || quantity < 0)) {
    return ResponseHandler(res, "orderItem", 406, lang);
  }

  try {
    const orderItem = await OrderItem.findById(orderItemId);

    if (!orderItem) {
      return ResponseHandler(res, "orderItem", 404, lang);
    }

    if (couponCode) orderItem.couponCode = couponCode;
    if (quantity) orderItem.quantity = quantity;

    await orderItem.save();

    return ResponseHandler(res, "common", 202, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
