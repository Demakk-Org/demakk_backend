import { config } from "dotenv";
import responsse from "../../../responsse.js";
import OrderStatus from "../../models/orderStatusSchema.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Order from "../../models/orderSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const deleteOrderStatus = async (req, res) => {
  let { lang, orderStatusId } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!orderStatusId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  try {
    Order.findOne({ orderStatus: orderStatusId }).then(async (data) => {
      if (data) {
        return ResponseHandler(res, "orderStatus", 404, lang);
      }
      const orderStatus = await OrderStatus.findByIdAndDelete(orderStatusId);

      if (!orderStatus) {
        return ResponseHandler(res, "orderStatus", 407, lang);
      }

      return ResponseHandler(res, "common", 203, lang);
    });
  } catch (error) {
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default deleteOrderStatus;