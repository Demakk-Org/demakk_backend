import { config } from "dotenv";
import response from "../../../response.js";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";
import Coupon from "../../models/couponSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const getCoupon = async (req, res) => {
  let { lang } = req.body;
  let couponId = req.params.id;

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
    const coupon = await Coupon.findById(couponId)
      .select("-createdAt -updatedAt -__v")
      .populate({ path: "discountTypeId", select: "name aboveAmount" })
      .populate({
        path: "appliesToProductCategory",
        select: "nam stockItem additionalPrice",
        populate: { path: "stockItem", select: "name price" },
      });

    if (!coupon) {
      return ErrorHandler(res, 485, lang);
    }

    return ErrorHandler(res, 200, lang, coupon);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
