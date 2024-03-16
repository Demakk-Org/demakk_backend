import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Coupon from "../../models/couponSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const getCoupon = async (req, res) => {
  let { lang } = req.body;
  let couponId = req.params.id;

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
    const coupon = await Coupon.findById(couponId)
      .select("-createdAt -updatedAt -__v")
      .populate({ path: "discountTypeId", select: "name aboveAmount" })
      .populate({
        path: "appliesToProductCategory",
        select: "nam stockItem additionalPrice",
        populate: { path: "stockItem", select: "name price" },
      });

    if (!coupon) {
      return ResponseHandler(res, "coupon", 404, lang);
    }

    return ResponseHandler(res, "common", 200, lang, coupon);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
