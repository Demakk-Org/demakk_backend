import { config } from "dotenv";
import response from "../../../response.js";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isDateValid } from "../../utils/validate.js";
import Coupon from "../../models/couponSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const updateCoupon = async (req, res) => {
  let {
    couponId,
    name,
    discountTypeId,
    discountAmount,
    appliesTo,
    endsAt,
    lang,
  } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!couponId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(couponId)) {
    return ErrorHandler(res, 432, lang);
  }

  if (!name && !discountTypeId && !discountAmount && !appliesTo && !endsAt) {
    return ErrorHandler(res, 400, lang);
  }

  if (name && typeof name !== "string") {
    return ErrorHandler(res, 482, lang);
  }

  if (discountTypeId && !isValidObjectId(discountTypeId)) {
    return ErrorHandler(res, 483, lang);
  }

  if (discountAmount && typeof discountAmount !== "number") {
    return ErrorHandler(res, 484, lang);
  }

  if (appliesTo && !Array.isArray(appliesTo)) {
    return ErrorHandler(res, 437, lang);
  }

  appliesTo?.forEach((item) => {
    if (!isValidObjectId(item)) {
      return ErrorHandler(res, 437, lang);
    }
  });

  if (endsAt && !isDateValid(endsAt)) {
    return ErrorHandler(res, 485, lang);
  }

  try {
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return ErrorHandler(res, 485, lang);
    }

    if (name) coupon.name = name;
    if (discountTypeId) coupon.discountTypeId = discountTypeId;
    if (discountAmount) coupon.discountAmount = discountAmount;
    if (appliesTo) coupon.appliesToProductCategory = appliesTo;
    if (endsAt) coupon.endsAt = endsAt;

    await coupon.save();

    return ErrorHandler(res, 203, lang, coupon);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
