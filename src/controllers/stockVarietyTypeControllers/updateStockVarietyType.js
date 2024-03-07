import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import { StockVarietyType } from "../../models/stockVarietyTypeSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const updateStockVarietytype = async (req, res) => {
  let { stockVarietyTypeId, name, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockVarietyTypeId || !name) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(stockVarietyTypeId)) {
    return ErrorHandler(res, 498, lang);
  }

  if (typeof name !== "string") {
    return ErrorHandler(res, 496, lang);
  }

  try {
    const stockVarietyType = await StockVarietyType.findById(
      stockVarietyTypeId
    );

    if (!stockVarietyType) {
      return ErrorHandler(res, 499, lang);
    }

    stockVarietyType.name = name;
    await stockVarietyType.save();

    return ErrorHandler(res, 203, lang, stockVarietyType);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
