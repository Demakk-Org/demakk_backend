import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import OrderItem from "../../models/orderItemSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addOrderItem = async (req, res) => {
  let { orderId, quantity, price, couponCode, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!orderId || !quantity || !price) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(orderId)) {
    return ErrorHandler(res, 464, lang);
  }

  if (typeof quantity !== "number") {
    return ErrorHandler(res, 465, lang);
  }

  if (typeof price !== "number") {
    return ErrorHandler(res, 443, lang);
  }

  if (couponCode && !isValidObjectId(couponCode)) {
    return ErrorHandler(res, 466, lang);
  }

  try {
    const orderItem = await OrderItem.create({
      orderId,
      quantity,
      unitPrice: price,
      couponCode,
    });

    return ErrorHandler(res, 201, lang, orderItem);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
