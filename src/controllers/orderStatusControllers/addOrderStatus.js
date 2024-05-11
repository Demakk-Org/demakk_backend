import { config } from "dotenv";
import responsse from "../../../responsse.js";
import OrderStatus from "../../models/orderStatusSchema.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { camelize } from "../../utils/validate.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addOrderStatus = async (req, res) => {
  let { name, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!name) {
    return ResponseHandler(res, "common", 400, lang);
  }

  try {
    const orderStatus = await OrderStatus.findOne({ name: camelize(name) });

    if (orderStatus) {
      return ResponseHandler(res, "orderStatus", 406, lang);
    }

    OrderStatus.create({ name: camelize(name) }).then((orderStatus) => {
      return ResponseHandler(res, "common", 201, lang, orderStatus);
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default addOrderStatus;
