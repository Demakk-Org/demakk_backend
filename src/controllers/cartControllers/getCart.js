import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Cart from "../../models/cartSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const getCart = async (req, res) => {
  let { lang } = req.body;

  let cartId = req.user.cart;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  try {
    const cart = await Cart.findById(cartId)
      .populate({
        path: "orderItems",
        select: "product quantity",
        populate: { path: "product", select: "name price images" },
      })
      .select("orderItems");

    if (!cart) {
      return ResponseHandler(res, "cart", 404, lang);
    }

    return ResponseHandler(res, "common", 200, lang, cart);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
