import { config } from "dotenv";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { isValidObjectId } from "mongoose";
import Discount from "../../models/discountSchema.js";
import { isArr } from "../../utils/validate.js";
import isProductInOtherDiscount from "../../utils/isProductInOtherDiscount.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addDiscount = async (req, res) => {
  let { lang, discountTypeId, discountAmount, products, aboveAmount } =
    req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (
    !discountTypeId ||
    (!discountAmount && discountAmount != 0) ||
    !products ||
    (products && products.length == 0)
  ) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(discountTypeId)) {
    return ResponseHandler(res, "discountType", 402, lang);
  }

  if (typeof discountAmount != "number") {
    return ResponseHandler(res, "discount", 406, lang);
  }

  if (!isArr(products, "string")) {
    return ResponseHandler(res, "discount", 408, lang);
  }

  products?.forEach((item) => {
    if (!isValidObjectId(item)) {
      return ResponseHandler(res, "product", 402, lang);
    }
  });

  if (aboveAmount && (typeof aboveAmount != "number" || aboveAmount == 0)) {
    return ResponseHandler(res, "discount", 405, lang);
  }

  try {
    const exists = await isProductInOtherDiscount(products);

    if (exists) {
      return ResponseHandler(res, "discount", 410, lang);
    }

    const discount = await Discount.create({
      discountType: discountTypeId,
      discountAmount,
      products,
      aboveAmount,
    });

    if (!discount) {
      return ResponseHandler(res, "common", 500, lang);
    }

    return ResponseHandler(res, "common", 201, lang, discount);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default addDiscount;
