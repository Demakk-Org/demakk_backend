import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import { StockVariety } from "../../models/stockVarietySchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const deleteStockVariety = async (req, res) => {
  let { stockVarietyId, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockVarietyId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(stockVarietyId)) {
    //invalid stock Variety Id
    return ErrorHandler(res, 498, lang);
  }

  try {
    const stockVariety = await StockVariety.findByIdAndDelete(stockVarietyId);

    if (!stockVariety) {
      return ErrorHandler(res, 499, lang); //stockVariety not found
    }

    return ErrorHandler(res, 204, lang);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
