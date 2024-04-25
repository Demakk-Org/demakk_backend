import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { isValidObjectId } from "mongoose";
import Discount from "../../models/discountSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getDiscount = async (req, res) => {
  let { id } = req.params;
  let { lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!id) {
    return ResponseHandler(res, "common", 400, lang);
  }

  console.log(id);

  if (!isValidObjectId(id)) {
    return ResponseHandler(res, "discount", 402, lang);
  }

  try {
    const discount = await Discount.findById(id).populate("deal");

    if (!discount) {
      return ResponseHandler(res, "discount", 404, lang);
    }

    return ResponseHandler(res, "common", 200, lang, discount);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default getDiscount;
