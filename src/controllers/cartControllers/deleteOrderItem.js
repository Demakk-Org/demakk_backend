import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import { isArr } from "../../utils/validate.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import responsse from "../../../responsse.js";
import Cart from "../../models/cartSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

async function deleteOrderItems(req, res) {
  let { orderItems, lang } = req.body;

  let cartId = req.user.cart;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!orderItems) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isArr(orderItems, "string")) {
    return ResponseHandler(res, "orderItem", 401, lang);
  }

  orderItems?.forEach((item) => {
    console.log("Order");
    if (!isValidObjectId(item)) {
      return ResponseHandler(res, "orderItem", 402, lang);
    }
  });

  try {
    let cart = await Cart.findById(cartId);

    if (!cart) {
      return ResponseHandler(res, "cart", 404, lang);
    }

    orderItems.forEach((orderItem) => {
      cart.orderItems = cart.orderItems.filter(
        (item) => item.toString() !== orderItem
      );
    });

    await cart.save();

    return ResponseHandler(res, "common", 203, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
}

export { deleteOrderItems };
