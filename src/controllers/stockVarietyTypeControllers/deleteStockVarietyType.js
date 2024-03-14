import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import { StockVarietyType } from "../../models/stockVarietyTypeSchema.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

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
    //return ErrorHandler(res, 400, lang);
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockVarietyTypeId)) {
    //return ErrorHandler(res, 4498, lang);
    return ResponseHandler(res, "stockVarietyType", 407, lang);
  }

  try {
    StockVarietyType.findByIdAndDelete(stockVarietyTypeId).then((data) => {
      //return ErrorHandler(res, 204, lang);
      return ResponseHandler(res, "common", 203, lang);
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
