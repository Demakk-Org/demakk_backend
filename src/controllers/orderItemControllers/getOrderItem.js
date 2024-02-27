import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import OrderItem from "../../models/orderItemSchema.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const getOrderItem = async (req, res) => {
  let { lang, orderItemId } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!orderItemId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(orderItemId)) {
    return ErrorHandler(res, 445, lang);
  }

  try {
    const orderItem = await OrderItem.findById(orderItemId).populate({
      path: "product",
      select: "name price images",
    });

    if (!orderItem) {
      return ErrorHandler(res, 481, lang);
    }

    return ErrorHandler(res, 200, lang, orderItem);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
