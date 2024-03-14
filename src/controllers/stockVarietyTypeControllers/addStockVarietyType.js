import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { StockVarietyType } from "../../models/stockVarietyTypeSchema.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

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
    //return ResponseHandler(res, 400, lang);
    return ResponseHandler(res, "common", 400, lang);
  }

  if (typeof name !== "string") {
    //return ErrorHandler(res, 496, lang);
    return ResponseHandler(res, "common", 406, lang);
  }

  try {
    const stockVarietyType = await StockVarietyType.findOne({ name });

    if (stockVarietyType) {
      //return ErrorHandler(res, 497, lang);
      return ResponseHandler(res, "stockVaraietyType", 406, lang);
    }

    StockVarietyType.create({ name }).then((data) => {
      //return ErrorHandler(res, 201, lang, data);
      return ResponseHandler(res, "common", 201, lang, data);
    });
  } catch (error) {
    console.log(error.message);
    //return ErrorHandler(res, 500, lang);
    return ResponseHandler(res, "common", 500, lang);
  }
};
