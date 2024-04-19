import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { isValidObjectId } from "mongoose";
import Discount, { statusEnum } from "../../models/discountSchema.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { isArr } from "../../utils/validate.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateDiscount = async (req, res) => {
  let {
    discountId,
    discountTypeId,
    discountAmount,
    products,
    status,
    aboveAmount,
    lang,
  } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!discountId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(discountId)) {
    return ResponseHandler(res, "discount", 402, lang);
  }

  if (
    !discountTypeId &&
    !discountAmount &&
    !products &&
    // products?.length == 0 &&
    !status &&
    !aboveAmount
  ) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (discountTypeId && !isValidObjectId(discountTypeId)) {
    return ResponseHandler(res, "discountType", 402, lang);
  }

  if (discountAmount && typeof discountAmount !== "number") {
    return ResponseHandler(res, "discount", 406, lang);
  }

  if (products && !isArr(products, "string" || products.length == 0)) {
    return ResponseHandler(res, "discount", 408, lang);
  }

  products?.forEach((item) => {
    if (!isValidObjectId(item)) {
      return ResponseHandler(res, "product", 402, lang);
    }
  });

  if (
    status &&
    (typeof status != "string" || !statusEnum.includes(status.toLowerCase()))
  ) {
    return ResponseHandler(res, "discount", 409, lang);
  }

  if (aboveAmount && (typeof aboveAmount != "number" || aboveAmount <= 0)) {
    return ResponseHandler(res, "discount", 405, lang);
  }

  try {
    const discount = await Discount.findById(discountId);

    if (!discount) {
      return ResponseHandler(res, "discount", 404, lang);
    }

    if (discountTypeId) discount.discountType = discountTypeId;
    if (discountAmount) discount.discountAmount = discountAmount;
    if (products) discount.products = products;
    if (status) discount.status = status;
    if (aboveAmount) discount.aboveAmount = aboveAmount;

    await discount.save();

    return ResponseHandler(res, "common", 202, lang, discount);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default updateDiscount;
