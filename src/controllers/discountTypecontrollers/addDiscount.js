import DiscountType from "../../models/discountTypeSchema.js";
import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addDiscount = async (req, res) => {
  let { name, above, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!name) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (typeof name !== "string") {
    //return ErrorHandler(res, 492, lang);
    return ResponseHandler(res, "discountType", 401, lang);
  }
  if (above && (typeof above !== "number" || above < 0)) {
    //return ErrorHandler(res, 493, lang);
    return ResponseHandler(res, "discountType", 405, lang);
  }

  try {
    const discountType = await DiscountType.findOne({ name });
    if (!discountType) {
      //return ErrorHandler(res, 491, lang);
      return ResponseHandler(res, "discountType", 404, lang);
    }
    DiscountType.create({ name, aboveAmount: above }).then((data) => {
      return ResponseHandler(res, "common", 201, lang, data);
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
