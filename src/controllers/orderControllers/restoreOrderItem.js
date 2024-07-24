import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { isValidObjectId } from "mongoose";
import OrderItem from "../../models/orderItemSchema.js";

const { LANG } = config(process.cwd, ".env").parsed;

const restoreOrderItem = async (req, res) => {
  let { orderItemId, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!orderItemId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(orderItemId)) {
    return ResponseHandler(res, "orderItem", 402, lang);
  }

  try {
    const orderItem = await OrderItem.findById(orderItemId);

    orderItem.isActive = true;

    orderItem
      .save()
      .then(() => {
        return ResponseHandler(res, "common", 202, lang);
      })
      .catch((err) => {
        console.log(err);
        return ResponseHandler(res, "common", 500, lang);
      });
  } catch (error) {
    console.log(error);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default restoreOrderItem;
