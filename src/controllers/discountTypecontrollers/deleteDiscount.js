import DiscountType from "../../models/discountTypeSchema.js";
import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { aborted } from "util";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const deleteDiscount = async (req, res) => {
  let { discountTypeId, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }
  if (!discountTypeId) {
    return ErrorHandler(res, 400, lang);
  }

  try {
    const deletedDiscount = await DiscountType.findByIdAndDelete(
      discountTypeId
    );
    if (!deletedDiscount) {
      return ErrorHandler(res, 424, lang);
    }
    return ErrorHandler(res, 204, lang);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
