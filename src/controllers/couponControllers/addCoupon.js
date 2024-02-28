import { config } from "dotenv";
import response from "../../../response.js";
import { isValidObjectId } from "mongoose";
import { isArr, isDateValid } from "../../utils/validate.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import Coupon from "../../models/couponSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addCoupon = async (req, res) => {
  let { name, discountTypeId, discountAmount, appliesTo, endsAt, lang } =
    req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!name || !discountTypeId || !discountAmount || !appliesTo || !endsAt) {
    return ErrorHandler(res, 400, lang);
  }

  if (typeof name !== "string") {
    return ErrorHandler(res, 482, lang);
  }

  if (!isValidObjectId(discountTypeId)) {
    return ErrorHandler(res, 483, lang);
  }

  if (typeof discountAmount !== "number") {
    return ErrorHandler(res, 484, lang);
  }

  if (!isArr(appliesTo, "string")) {
    return ErrorHandler(res, 437, lang);
  }

  appliesTo?.forEach((item) => {
    if (!isValidObjectId(item)) {
      return ErrorHandler(res, 437, lang);
    }
  });

  if (!isDateValid(endsAt)) {
    return ErrorHandler(res, 469, lang);
  }

  try {
    const coupon = await Coupon.create({
      name,
      discountTypeId,
      discountAmount,
      appliesToProductCategory: appliesTo,
      endsAt,
    });

    return ErrorHandler(res, 201, lang, coupon);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};