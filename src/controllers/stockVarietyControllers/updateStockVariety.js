import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { StockVariety } from "../../models/stockVarietySchema.js";
import { isArr } from "../../utils/validate.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const updateStockVariety = async (req, res) => {
  let {
    stockVarietyId,
    stockVarietyTypeId,
    productId,
    price,
    numberOfAvailable,
    value,
    subVariants,
    type,
    image,
    lang,
  } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (
    !stockVarietyId ||
    (!stockVarietyTypeId &&
      !value &&
      !price &&
      !productId &&
      !numberOfAvailable &&
      !subVariants &&
      !image &&
      !type)
  ) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockVarietyId)) {
    return ResponseHandler(res, "stockVariety", 402, lang);
  }

  if (stockVarietyTypeId && !isValidObjectId(stockVarietyTypeId)) {
    return ResponseHandler(res, "stockVarietyType", 402, lang);
  }

  if (productId && !isValidObjectId(productId)) {
    return ResponseHandler(res, "product", 402, lang);
  }

  if (price && (typeof price !== "number" || price <= 0)) {
    return ResponseHandler(res, "common", 407, lang);
  }

  if (
    numberOfAvailable &&
    (typeof numberOfAvailable !== "number" || numberOfAvailable < 0)
  ) {
    return ResponseHandler(res, "stockVariety", 407, lang);
  }

  if (value && typeof value !== "string") {
    return ResponseHandler(res, "stockVarietyType", 408, lang);
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
    const stockVariety = await StockVariety.findById(stockVarietyId);

    if (!stockVariety) {
      return ResponseHandler(res, "stockVariety", 404, lang);
    }

    if (value) stockVariety.value = value;
    if (stockVarietyTypeId) stockVariety.stockVarietyType = stockVarietyTypeId;
    if (productId) stockVariety.product = productId;
    if (price) stockVariety.price = price;
    if (numberOfAvailable) stockVariety.numberOfAvailable = numberOfAvailable;
    if (subVariants) stockVariety.subVariants = subVariants;
    if (type) stockVariety.type = type;
    if (image) stockVariety.image = image;

    await stockVariety.save();

    return ResponseHandler(res, "common", 202, lang, stockVariety);
  } catch (error) {
    console.error(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
