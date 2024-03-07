import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import { StockVariety } from "../../models/stockVarietySchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const updateStockVariety = async (req, res) => {
  let { stockVarietyId, stockVarietyTypeId, value, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockVarietyId || (!stockVarietyTypeId && !value)) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(stockVarietyId)) {
    //invalid stock Variety id value
    return ErrorHandler(res, 499.2, lang);
  }

  if (stockVarietyTypeId && !isValidObjectId(stockVarietyTypeId)) {
    //invalid stock variant type id value
    return ErrorHandler(res, 498, lang);
  }

  if (value && typeof value !== "string") {
    //invalid stock variety value
    return ErrorHandler(res, 496, lang);
  }

  try {
    const stockVariety = await StockVariety.findById(stockVarietyId);

    if (!stockVariety) {
      return ErrorHandler(res, 499, lang); //stock variety not found
    }

    if (value) stockVariety.value = value;
    if (stockVarietyTypeId) stockVariety.stockVarietyType = stockVarietyTypeId;

    await stockVariety.save();

    return ErrorHandler(res, 203, lang, stockVariety);
  } catch (error) {
    console.error(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
