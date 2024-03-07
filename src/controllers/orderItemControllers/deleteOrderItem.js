import { config } from "dotenv";
import OrderItem from "../../models/orderItemSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const deleteOrderItem = async (req, res) => {
  let { orderItemId, lang } = req.body;

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
    const orderItem = await OrderItem.findByIdAndDelete(orderItemId);

    if (!orderItem) {
      return ErrorHandler(res, 481, lang);
    }

    return ErrorHandler(res, 204, lang);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
