import { config } from "dotenv";
import { isValidObjectId } from "mongoose";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Coupon from "../../models/couponSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const deleteCoupon = async (req, res) => {
  let { couponId, lang } = req.body;

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

  try {
    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
      return ResponseHandler(res, "coupon", 404, lang);
    }

    return ResponseHandler(res, "common", 203, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
