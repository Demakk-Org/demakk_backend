import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import Cart from "../../models/cartSchema.js";
import { isArr } from "../../utils/validate.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

async function deleteOrderItems(req, res) {
  let { orderItems, lang } = req.body;

  let cartId = req.user.cart;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!orderItems) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isArr(orderItems, "string")) {
    return ErrorHandler(res, 444, lang);
  }

  orderItems?.forEach((item) => {
    console.log("Order");
    if (!isValidObjectId(item)) {
      return ErrorHandler(res, 444, lang);
    }
  });

  try {
    let cart = await Cart.findById(cartId);
    console.log(cart);

    if (!cart) {
      return ErrorHandler(res, 417, lang);
    }

    orderItems.forEach((orderItem) => {
      cart.orderItems = cart.orderItems.filter(
        (item) => item.toString() !== orderItem
      );
    });

    await cart.save();

    return ErrorHandler(res, 200, lang);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
}

export { deleteOrderItems };
