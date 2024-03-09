import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import DiscountType from "../../models/discountTypeSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const updateDiscountType = async (req, res) => {
  let { discountTypeId, name, above, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!discountTypeId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(discountTypeId)) {
    return ResponseHandler(res, "discountType", 402, lang);
  }

  if (!name && !above) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (name && typeof name !== "string") {
    return ResponseHandler(res, "discountType", 401, lang);
  }
  if (above && (typeof above !== "number" || above < 0)) {
    return ResponseHandler(res, "discountType", 405, lang);
  }

  try {
    const discountType = await DiscountType.findById(discountTypeId);

    if (!discountType) {
      return ResponseHandler(res, "discountType", 404, lang);
    }

    if (name) {
      if (name == discountType.name) {
        return ResponseHandler(res, "discountType", 406, lang);
      }

      discountType.name = name;
    }
    if (above) discountType.aboveAmount = above;

    await discountType.save();

    return ResponseHandler(res, "common", 202, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
