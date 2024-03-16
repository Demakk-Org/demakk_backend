import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import OrderItem from "../../models/orderItemSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const getOrderItem = async (req, res) => {
  let { lang, orderItemId } = req.body;

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

  try {
    const orderItem = await OrderItem.findById(orderItemId).populate({
      path: "product",
      select: "name price images",
    });

    if (!orderItem) {
      return ResponseHandler(res, "orderItem", 404, lang);
    }

    return ResponseHandler(res, "common", 200, lang, orderItem);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
