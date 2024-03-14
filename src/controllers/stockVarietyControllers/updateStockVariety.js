import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { StockVariety } from "../../models/stockVarietySchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const updateStockVariety = async (req, res) => {
  let { stockVarietyId, stockVarietyTypeId, value, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockVarietyId || (!stockVarietyTypeId && !value)) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockVarietyId)) {
    return ResponseHandler(res, "stockVariety", 402, lang);
  }

  if (stockVarietyTypeId && !isValidObjectId(stockVarietyTypeId)) {
    return ResponseHandler(res, "stockVarietyType", 402, lang);
  }

  if (value && typeof value !== "string") {
    return ResponseHandler(res, "stockVarietyType", 408, lang);
  }

  try {
    const stockVariety = await StockVariety.findById(stockVarietyId);

    if (!stockVariety) {
      return ResponseHandler(res, "stockVariety", 404, lang);
    }

    if (value) stockVariety.value = value;
    if (stockVarietyTypeId) stockVariety.stockVarietyType = stockVarietyTypeId;

    await stockVariety.save();

    return ResponseHandler(res, "common", 202, lang, stockVariety);
  } catch (error) {
    console.error(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
