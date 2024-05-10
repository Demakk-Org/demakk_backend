import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { StockVarietyType } from "../../models/stockVarietyTypeSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addStockVarietyType = async (req, res) => {
  let { name, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!name) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (typeof name !== "string") {
    return ResponseHandler(res, "stockVarietyType", 401, lang);
  }

  try {
    const stockVarietyType = await StockVarietyType.findOne({ name });

    if (stockVarietyType) {
      return ResponseHandler(res, "stockVarietyType", 406, lang);
    }

    StockVarietyType.create({ name }).then((data) => {
      return ResponseHandler(res, "common", 201, lang, data);
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
