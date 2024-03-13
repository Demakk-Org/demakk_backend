import { config } from "dotenv";
import { isDateValid } from "../../utils/validate.js";
import response from "../../../response.js";
import Order from "../../models/orderSchema.js";
import Cart from "../../models/cartSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import User from "../../models/userSchema.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addOrder = async (req, res) => {
  let { deliveryDate, lang } = req.body;
  let uid = req.uid;
  let { cart } = req.user;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (deliveryDate && !isDateValid(deliveryDate)) {
    //return ErrorHandler(res, 469, lang);
    return ResponseHandler(res, "common", 405, lang)
  }

  const cartInfo = await Cart.findById(cart);

  if (!cartInfo) {
    //return ErrorHandler(res, 417, lang);
    return ResponseHandler(res, "cart", 400, lang)
  }

  if (cartInfo.orderItems.length == 0) {
    //return ErrorHandler(res, 467, lang);
    return ResponseHandler(res, "orderItem", 405, lang)
  }

  try {
    Order.create({
      user: uid,
      orderItems: cartInfo.orderItems,
      deliveryDate,
      orderStatus: "65a6f9a6e2caf4bfc91f2b27",
    }).then(async (data) => {
      let user = await User.findById(uid);

      user.orders.push(data._id);
      await user.save();

      return ResponseHandler(res, "common", 201, lang, data);
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, LANG);
  }
};
