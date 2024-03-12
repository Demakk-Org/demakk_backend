import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import { StockVariety } from "../../models/stockVarietySchema.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addStockVariety = async (req, res) => {
  let { lang, value, stockVarietyTypeId } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!value && !stockVarietyTypeId) {
    //return ErrorHandler(res, 400, lang);
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockVarietyTypeId)) {
    //return ErrorHandler(res, 498, lang);
    return ResponseHandler(res, "stockVarietyType", 407, lang);
  }

  if (typeof value != "string") {
    //return ErrorHandler(res, 496, lang);
    return ResponseHandler(res, "stockVarietyType", 408, lang);
  }

  try {
    StockVariety.create({ value, stockVarietyType: stockVarietyTypeId }).then(
      (data) => {
        //return ErrorHandler(res, 201, lang, data);
        return ResponseHandler(res, "common", 201, lang, data);
      }
    );
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
