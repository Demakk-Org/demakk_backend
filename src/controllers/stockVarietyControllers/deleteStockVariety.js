import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import { StockVariety } from "../../models/stockVarietySchema.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

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
    //invalid stock Variety Id
    //return ErrorHandler(res, 498, lang);
    return ResponseHandler(res, "stockVariety", 407, lang);
  }

  try {
    const stockVariety = await StockVariety.findByIdAndDelete(stockVarietyId);

    if (!stockVariety) {
      //return ErrorHandler(res, 499, lang); //invalid stockVariety id
      return ResponseHandler(res, "stockVariety", 404, lang);
    }

    //return ErrorHandler(res, 204, lang);
    return ResponseHandler(res, "common", 203, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
