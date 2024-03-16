import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import { isDateValid } from "../../utils/validate.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
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

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!couponId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(couponId)) {
    return ResponseHandler(res, "coupon", 402, lang);
  }

  if (!name && !discountTypeId && !discountAmount && !appliesTo && !endsAt) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (name && typeof name !== "string") {
    return ResponseHandler(res, "common", 401, lang);
  }

  if (discountTypeId && !isValidObjectId(discountTypeId)) {
    return ResponseHandler(res, "discountType", 402, lang);
  }

  if (discountAmount && typeof discountAmount !== "number") {
    return ResponseHandler(res, "discountType", 405, lang);
  }

  if (appliesTo && !Array.isArray(appliesTo)) {
    return ResponseHandler(res, "productCategory", 402, lang);
  }

  appliesTo?.forEach((item) => {
    if (!isValidObjectId(item)) {
      return ResponseHandler(res, "productCategory", 402, lang);
    }
  });

  if (endsAt && !isDateValid(endsAt)) {
    return ResponseHandler(res, "common", 405, lang);
  }

  try {
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return ResponseHandler(res, "coupon", 404, lang);
    }

    if (name == coupon.name) {
      return ResponseHandler(res, "coupon", 405, lang);
    }

    if (name) coupon.name = name;
    if (discountTypeId) coupon.discountTypeId = discountTypeId;
    if (discountAmount) coupon.discountAmount = discountAmount;
    if (appliesTo) coupon.appliesToProductCategory = appliesTo;
    if (endsAt) coupon.endsAt = endsAt;

    await coupon.save();

    return ResponseHandler(res, "common", 202, lang, coupon);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
