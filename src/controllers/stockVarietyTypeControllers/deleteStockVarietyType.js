import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { StockVarietyType } from "../../models/stockVarietyTypeSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const deleteStockVarietyType = async (req, res) => {
  let { stockVarietyTypeId, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockVarietyTypeId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockVarietyTypeId)) {
    return ResponseHandler(res, "stockVarietyType", 402, lang);
  }

  try {
    const stockVarietyType = await StockVarietyType.findByIdAndDelete(
      stockVarietyTypeId
    );

    if (!stockVarietyType) {
      return ResponseHandler(res, "stockVarietyType", 404, lang);
    }

    return ResponseHandler(res, "common", 203, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
