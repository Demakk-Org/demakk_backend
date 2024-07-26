import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import OrderItem from "../../models/orderItemSchema.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const checkAllOrderItems = async (req, res) => {
  let { lang, isChecked, orderItems } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  let cartId = req.user.cart;

  if (
    !cartId ||
    typeof isChecked !== "boolean" ||
    !Array.isArray(orderItems) ||
    orderItems.length == 0
  ) {
    return ResponseHandler(res, "common", 400, lang);
  }

  let isValid = true;

  orderItems.forEach((orderItem) => {
    if (!isValidObjectId(orderItem)) {
      isValid = false;
    }
  });

  if (!isValid) {
    return ResponseHandler(res, "orderItem", 402, lang);
  }

  try {
    Promise.all(
      orderItems.map((orderItem) => {
        try {
          return OrderItem.findByIdAndUpdate(orderItem, {
            isChecked,
          });
        } catch (error) {
          console.log(error);
        }
      })
    )
      .then(() => {
        return ResponseHandler(res, "common", 200, lang);
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
