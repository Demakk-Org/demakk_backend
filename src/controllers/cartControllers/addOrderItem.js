import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import Cart from "../../models/cartSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

async function addOrderItem(req, res) {
  let { orderItem, lang } = req.body;
  let cartId = req.user.cart;
  console.log(cartId);

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!orderItem) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(orderItem)) {
    return ErrorHandler(res, 444, lang);
  }

  try {
    let cart = await Cart.findById(cartId);

    if (!cart) {
      return ErrorHandler(res, 417, lang);
    }

    cart.orderItems.push(orderItem);
    await cart.save();

    return ErrorHandler(res, 200, lang);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
}

export default addOrderItem;
