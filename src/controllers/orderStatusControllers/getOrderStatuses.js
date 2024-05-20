import { config } from "dotenv";
import responsse from "../../../responsse.js";
import OrderStatus from "../../models/orderStatusSchema.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getOrderStatuses = async (req, res) => {
  let { lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  try {
    const orderStatuses = await OrderStatus.find({}).select("-__v");

    return ResponseHandler(res, "common", 200, lang, orderStatuses);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default getOrderStatuses;
