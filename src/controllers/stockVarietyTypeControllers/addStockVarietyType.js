import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { StockVarietyType } from "../../models/stockVarietyTypeSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addStockVarietyType = async (req, res) => {
  let { name, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!name) {
    return ErrorHandler(res, 400, lang);
  }

  if (typeof name !== "string") {
    return ErrorHandler(res, 496, lang);
  }

  try {
    const stockVarietyType = await StockVarietyType.findOne({ name });

    if (stockVarietyType) {
      return ErrorHandler(res, 497, lang);
    }

    StockVarietyType.create({ name }).then((data) => {
      return ErrorHandler(res, 201, lang, data);
    });
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
