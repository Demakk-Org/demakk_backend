import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { StockVariety } from "../../models/stockVarietySchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addStockVariety = async (req, res) => {
  let { lang, value, stockVarietyTypeId } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!value || !stockVarietyTypeId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockVarietyTypeId)) {
    return ResponseHandler(res, "stockVarietyType", 402, lang);
  }

  if (typeof value != "string") {
    return ResponseHandler(res, "stockVarietyType", 408, lang);
  }

  try {
    const stockVariety = await StockVariety.create({
      value,
      stockVarietyType: stockVarietyTypeId,
    });

    return ResponseHandler(res, "common", 201, lang, stockVariety);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
