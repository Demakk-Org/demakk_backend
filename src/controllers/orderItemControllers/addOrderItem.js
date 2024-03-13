import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import OrderItem from "../../models/orderItemSchema.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addOrderItem = async (req, res) => {
  let { productId, quantity, couponCode, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!productId || !quantity) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(productId)) {
    //return ErrorHandler(res, 464, lang);
    return ResponseHandler(res, "product", 402, lang)
  }

  if (typeof quantity !== "number") {
    //return ErrorHandler(res, 465, lang);
    return ResponseHandler(res, "orderItem", 404, lang)
  }

  if (couponCode && !isValidObjectId(couponCode)) {
    //return ErrorHandler(res, 466, lang);
    return ResponseHandler(res, "coupon", 402, lang)
  }

  try {
    const orderItem = await OrderItem.create({
      product: productId,
      quantity,
      couponCode,
    });

    return ResponseHandler(res, "common", 201, lang, orderItem);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
