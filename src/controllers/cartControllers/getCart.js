import { config } from "dotenv";
import response from "../../../response.js";
import Cart from "../../models/cartSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const getCart = async (req, res) => {
  let { lang } = req.body;

  let cartId = req.user.cart;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  try {
    Cart.findById(cartId)
      .populate({
        path: "orderItems",
        select: "product quantity",
        populate: { path: "product", select: "name price images" },
      })
      .select("orderItems")
      .then((cart) => {
        return ErrorHandler(res, 200, lang, cart);
      });
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
