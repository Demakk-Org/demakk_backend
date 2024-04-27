import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { StockVariety } from "../../models/stockVarietySchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getStockVariety = async (req, res) => {
  let stockVarietyId = req.params.id;
  let { lang } = req.query;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (!stockVarietyId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockVarietyId)) {
    return ResponseHandler(res, "stockVariety", 402, lang);
  }

  try {
    const stockVariety = await StockVariety.findById(stockVarietyId).populate({
      path: "stockVarietyType",
      select: "-createdAt -updatedAt -__v",
    });

    if (!stockVariety) {
      return ResponseHandler(res, "stockVariety", 404, lang);
    }

    return ResponseHandler(res, "common", 200, lang, stockVariety);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default getStockVariety;
