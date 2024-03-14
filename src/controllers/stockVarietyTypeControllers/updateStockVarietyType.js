import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import { StockVarietyType } from "../../models/stockVarietyTypeSchema.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

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
    //return ErrorHandler(res, 400, lang);
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockVarietyTypeId)) {
    //return ErrorHandler(res, 498, lang);
    return ResponseHandler(res, "stockVarietyType", 407, lang);
  }

  if (typeof name !== "string") {
    //return ErrorHandler(res, 496, lang);
    return ResponseHandler(res, "common", 406, lang);
  }

  try {
    const stockVarietyType = await StockVarietyType.findById(
      stockVarietyTypeId
    );

    if (!stockVarietyType) {
      //return ErrorHandler(res, 499, lang);
      return ResponseHandler(res, "stockVarietyType", 404, lang);
    }

    stockVarietyType.name = name;
    await stockVarietyType.save();

    //return ErrorHandler(res, 203, lang, stockVarietyType);
    return ResponseHandler(res, "common", 202, lang, stockVarietyType);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
