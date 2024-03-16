import DiscountType from "../../models/discountTypeSchema.js";
import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const deleteDiscount = async (req, res) => {
  let { discountTypeId, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }
  if (!discountTypeId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  try {
    const deletedDiscount = await DiscountType.findByIdAndDelete(
      discountTypeId
    );
    if (!deletedDiscount) {
      //return ErrorHandler(res, 424, lang);
      return ResponseHandler(res, "discountType", 404, lang);
    }
    return ResponseHandler(res, "common", 203, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
