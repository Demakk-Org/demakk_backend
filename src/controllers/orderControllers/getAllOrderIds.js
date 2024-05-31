import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Order from "../../models/orderSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getAllOrderIds = async (req, res) => {
  let { lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  try {
    const orderIds = await Order.find({}).select("_id");

    return ResponseHandler(res, "common", 200, lang, orderIds);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default getAllOrderIds;
