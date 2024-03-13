import { config } from "dotenv";
import OrderItem from "../../models/orderItemSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const deleteOrderItem = async (req, res) => {
  let { orderItemId, lang } = req.body;

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
    //return ErrorHandler(res, 445, lang);
    return ResponseHandler(res, "orderItem", 402, lang)
  }

  try {
    const orderItem = await OrderItem.findByIdAndDelete(orderItemId);

    if (!orderItem) {
      //return ErrorHandler(res, 481, lang);
      return ResponseHandler(res, "orderItem", 404, lang)
    }

    return ResponseHandler(res, "common", 203, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
