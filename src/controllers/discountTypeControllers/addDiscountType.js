import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import DiscountType from "../../models/discountTypeSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addDiscountType = async (req, res) => {
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
    return ResponseHandler(res, "discountType", 401, lang);
  }

  if (above && (typeof above !== "number" || above < 0)) {
    return ResponseHandler(res, "discountType", 405, lang);
  }

  try {
    const discountType = await DiscountType.findOne({ name });

    if (discountType) {
      return ResponseHandler(res, "discountType", 406, lang);
    }

    DiscountType.create({ name, aboveAmount: above }).then((data) => {
      return ResponseHandler(res, "common", 201, lang, data);
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
