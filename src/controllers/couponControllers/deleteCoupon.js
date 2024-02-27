import { config } from "dotenv";
import response from "../../../response.js";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";
import Coupon from "../../models/couponSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const deleteCoupon = async (req, res) => {
  let { couponId, lang } = req.body;

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
    return ErrorHandler(res, 486, lang);
  }

  try {
    const coupon = await Coupon.findByIdAndDelete(couponId);

    if (!coupon) {
      return ErrorHandler(res, 485, lang);
    }

    return ErrorHandler(res, 204, lang);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
