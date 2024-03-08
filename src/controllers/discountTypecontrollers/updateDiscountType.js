import DiscountType from "../../models/discountTypeSchema.js";
import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const updateDiscount = async (req, res) => {
  let { discountTypeId, name, above, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }
  if (!discountTypeId) {
    return ErrorHandler(res, 400, lang);
  }
  if (!isValidObjectId(discountTypeId)) {
    return ErrorHandler(res, 496, lang);
  }

  if (!name && !above) {
    return ErrorHandler(res, 400, lang);
  }

  if (name && typeof name !== "string") {
    return ErrorHandler(res, 497, lang);
  }
  if (above && (typeof above !== "number" || above < 0)) {
    return ErrorHandler(res, 493, lang);
  }

  try {
    const discountType = await DiscountType.findById(discountTypeId);
    if (!discountType) {
      return ErrorHandler(res, 4, lang);
    }
    if (name) discountType.name = name;
    if (above) discountType.aboveAmount = above;
    await discountType.save();
    return ErrorHandler(res, 203, lang);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
