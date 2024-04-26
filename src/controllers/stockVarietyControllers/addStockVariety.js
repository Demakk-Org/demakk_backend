import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { StockVariety } from "../../models/stockVarietySchema.js";
import { Product } from "../../models/productSchema.js";
import { isArr } from "../../utils/validate.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addStockVariety = async (req, res) => {
  let {
    lang,
    value,
    stockVarietyTypeId,
    productId,
    price,
    image,
    numberOfAvailable,
    type,
    subVariants,
  } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (
    !value ||
    !stockVarietyTypeId ||
    !productId ||
    !price ||
    !numberOfAvailable
  ) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockVarietyTypeId)) {
    return ResponseHandler(res, "stockVarietyType", 402, lang);
  }

  if (typeof value != "string") {
    return ResponseHandler(res, "stockVarietyType", 408, lang);
  }

  if (!isValidObjectId(productId)) {
    return ResponseHandler(res, "product", 402, lang);
  }

  if (typeof price != "number") {
    return ResponseHandler(res, "common", 407, lang);
  }

  if (typeof numberOfAvailable != "number") {
    return ResponseHandler(res, "common", 407, lang);
  }

  if (type && typeof type != "string") {
    return ResponseHandler(res, "common", 410, lang);
  }

  if (image && typeof image != "string") {
    return ResponseHandler(res, "stockVariety", 412, lang);
  }

  if (subVariants && !isArr(subVariants, "string")) {
    return ResponseHandler(res, "stockVariety", 411, lang);
  }

  subVariants &&
    subVariants.forEach((variant) => {
      if (!isValidObjectId(variant)) {
        return ResponseHandler(res, "stockVariety", 402, lang);
      }
    });

  try {
    const exists = await StockVariety.findOne({ value, product: productId });

    if (exists) {
      return ResponseHandler(res, "stockVariety", 409, lang);
    }

    const product = await Product.findById(productId);

    if (!product) {
      return ResponseHandler(res, "product", 404, lang);
    }

    const stockVariety = await StockVariety.create({
      value,
      stockVarietyType: stockVarietyTypeId,
      product: productId,
      price,
      numberOfAvailable,
      type,
      image,
      subVariants,
    }).then(async (data) => {
      let variantList = [...product.productVariants, data._id];
      product.productVariants = variantList;
      await product.save();

      return ResponseHandler(res, "common", 201, lang, data);
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
