import { config } from "dotenv";

import { isDateValid } from "../../utils/validate.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import Order from "../../models/orderSchema.js";
import Cart from "../../models/cartSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addOrder = async (req, res) => {
  let { deliveryDate, deliveryAddressId, lang } = req.body;
  let uid = req.uid;
  let user = req.user;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (deliveryDate && !isDateValid(deliveryDate)) {
    return ResponseHandler(res, "common", 405, lang);
  }

  try {
    let cart = await Cart.findById(user.cart).populate("orderItems");

    if (!cart) {
      return ResponseHandler(res, "cart", 404, lang);
    }

    if (cart.orderItems.filter((oi) => oi.isChecked).length == 0) {
      return ResponseHandler(res, "common", 400, lang);
    }

    Order.create({
      user: uid,
      orderItems: cart.orderItems
        .filter((oi) => oi.isChecked)
        .map((oi) => oi._id),
      deliveryAddress: deliveryAddressId,
      deliveryDate,
      orderStatus: "663fd0f4f89e8b403ab77c90",
    }).then(async (data) => {
      user.orders.push(data._id);
      cart.orderItems = cart.orderItems.filter((oi) => !oi.isChecked);

      Promise.all([user.save(), cart.save()])
        .then(() => {
          return ResponseHandler(res, "common", 201, lang, { data });
        })
        .catch((err) => {
          console.log(err);
          return ResponseHandler(res, "common", 500, lang);
        });
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
