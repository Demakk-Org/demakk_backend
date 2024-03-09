import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import { StockVariety } from "../../models/stockVarietySchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addStockVariety = async (req, res) => {
  let { lang, value, stockVarietyTypeId } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!value && !stockVarietyTypeId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(stockVarietyTypeId)) {
    return ErrorHandler(res, 498, lang);
  }

  if (typeof value != "string") {
    return ErrorHandler(res, 496, lang);
  }

  try {
    const stockVariety = await StockVariety.create({
      value,
      stockVarietyType: stockVarietyTypeId,
    });

    return ErrorHandler(res, 201, lang, stockVariety);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
