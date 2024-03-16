import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import Order from "../../models/orderSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const getOrder = async (req, res) => {
  let { lang } = req.body;
  let orderId = req.params.id;
  let uid = req.uid;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!orderId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(orderId)) {
    return ResponseHandler(res, "order", 402, lang);
  }

  try {
    const order = await Order.findById(orderId)
      .select("-updatedAt -createdAt -__v -_id")
      .populate({
        path: "user",
        select: "firstName lastName email phoneNumber",
      })
      .populate({
        path: "orderStatus",
        select: "name",
      })
      .populate({
        path: "orderItems",
        select: "product quantity",
        populate: { path: "product", select: "name price images" },
      });

    console.log(order);

    if (!order) {
      return ResponseHandler(res, "order", 404, lang);
    }

    if (order.user?._id.toString() != uid) {
      return ResponseHandler(res, "order", 405, lang);
    }

    return ResponseHandler(res, "common", 200, lang, order);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
