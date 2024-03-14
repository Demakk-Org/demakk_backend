import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { StockVarietyType } from "../../models/stockVarietyTypeSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const updateStockVarietytype = async (req, res) => {
  let { stockVarietyTypeId, name, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockVarietyTypeId || !name) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockVarietyTypeId)) {
    return ResponseHandler(res, "stockVarietyType", 402, lang);
  }

  if (typeof name !== "string") {
    return ResponseHandler(res, "common", 401, lang);
  }

  try {
    const stockVarietyType = await StockVarietyType.findById(
      stockVarietyTypeId
    );

    if (!stockVarietyType) {
      return ResponseHandler(res, "stockVarietyType", 404, lang);
    }

    stockVarietyType.name = name;
    await stockVarietyType.save();

    return ResponseHandler(res, "common", 202, lang, stockVarietyType);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
