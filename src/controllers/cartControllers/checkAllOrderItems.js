import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Cart from "../../models/cartSchema.js";
import OrderItem from "../../models/orderItemSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const checkAllOrderItems = async (req, res) => {
  let { lang, isChecked } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  let cartId = req.user.cart;

  if (!cartId || (!isChecked && typeof isChecked !== "boolean")) {
    return ResponseHandler(res, "common", 400, lang);
  }

  try {
    let cart = await Cart.findById(cartId);

    if (!cart) {
      return ResponseHandler(res, "cart", 404, lang);
    }

    Promise.all(
      [...cart.orderItems].map((orderItem) => {
        try {
          return OrderItem.findByIdAndUpdate(orderItem._id, {
            isChecked,
          });
        } catch (error) {
          console.log(error);
        }
      })
    )
      .then(() => {
        return ResponseHandler(res, "common", 200, lang, cart);
      })
      .catch((error) => {
        console.log(error);
        return ResponseHandler(res, "common", 500, lang);
      });
  } catch (error) {
    console.log(error);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default checkAllOrderItems;
