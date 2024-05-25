import { config } from "dotenv";
import { isValidObjectId } from "mongoose";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Cart from "../../models/cartSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

async function addOrderItem(req, res) {
  let { orderItem, lang } = req.body;
  let cartId = req.user.cart;
  console.log(cartId);

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }
  console.log(orderItem);
  if (!orderItem) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(orderItem)) {
    return ResponseHandler(res, "orderItem", 402, lang);
  }

  try {
    let cart = await Cart.findById(cartId);

    if (!cart) {
      return ResponseHandler(res, "cart", 404, lang);
    }

    cart.orderItems.push(orderItem);
    await cart.save();

    return ResponseHandler(res, "common", 201, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
}

export default addOrderItem;
