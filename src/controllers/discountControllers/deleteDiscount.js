import { config } from "dotenv";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { isValidObjectId } from "mongoose";
import Discount from "../../models/discountSchema.js";
import responsse from "../../../responsse.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const deleteDiscount = async (req, res) => {
  let { discountId, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!discountId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(discountId)) {
    return ResponseHandler(res, "discount", 402, lang);
  }

  try {
    const discount = await Discount.findByIdAndDelete(discountId);

    if (!discount) {
      return ResponseHandler(res, "discount", 404, lang);
    }

    return ResponseHandler(res, "common", 203, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default deleteDiscount;
