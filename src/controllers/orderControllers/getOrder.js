import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import Order from "../../models/orderSchema.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

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
    //return ErrorHandler(res, 464, lang);
    return ResponseHandler(res, "order", 404, lang)
  }

  if (!isValidObjectId(orderId)) {
    //return ErrorHandler(res, 418, lang);
    return ResponseHandler(res, "402")
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
      //return ErrorHandler(res, 471, lang);
      return ResponseHandler(res, "order", 404, lang)
    }

    if (order.user?._id != uid) {
      //return ErrorHandler(res, 472, lang);
      return ResponseHandler(res, "order", 405, lang)
    }

    return ResponseHandler(res, "common", 200, lang, order);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
