import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { isArr, isDateValid } from "../../utils/validate.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Coupon from "../../models/couponSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addCoupon = async (req, res) => {
  let { name, discountTypeId, discountAmount, appliesTo, endsAt, lang } =
    req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!name || !discountTypeId || !discountAmount || !appliesTo || !endsAt) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (typeof name !== "string") {
    return ResponseHandler(res, "coupon", 401, lang);
  }

  if (!isValidObjectId(discountTypeId)) {
    return ResponseHandler(res, "discountType", 402, lang);
  }

  if (typeof discountAmount !== "number") {
    return ResponseHandler(res, "discountType", 405, lang);
  }

  if (!isArr(appliesTo, "string")) {
    return ResponseHandler(res, "productCategory", 402, lang);
  }

  appliesTo?.forEach((item) => {
    if (!isValidObjectId(item)) {
      return ResponseHandler(res, "productCategory", 402, lang);
    }
  });

  if (!isDateValid(endsAt)) {
    return ResponseHandler(res, "common", 405, lang);
  }

  try {
    const coupon = await Coupon.findOne({ name });

    if (coupon) {
      return ResponseHandler(res, "coupon", 405, lang);
    }

    Coupon.create({
      name,
      discountTypeId,
      discountAmount,
      appliesToProductCategory: appliesTo,
      endsAt,
    }).then((res) => {
      return ResponseHandler(res, "common", 201, lang, res);
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
