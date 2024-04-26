import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { StockVariety } from "../../models/stockVarietySchema.js";
import { Product } from "../../models/productSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const deleteStockVariety = async (req, res) => {
  let { stockVarietyId, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockVarietyId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockVarietyId)) {
    return ResponseHandler(res, "stockVariety", 402, lang);
  }

  try {
    const stockVariety = await StockVariety.findByIdAndDelete(stockVarietyId);

    if (!stockVariety) {
      return ResponseHandler(res, "stockVariety", 404, lang);
    }

    const product = await Product.findById(stockVariety.product).select(
      "productVariants"
    );

    const variantList = product?.productVariants.filter(
      (variant) => variant != stockVarietyId
    );

    product.productVariants = variantList;
    await product.save();

    return ResponseHandler(res, "common", 203, lang, stockVariety);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
