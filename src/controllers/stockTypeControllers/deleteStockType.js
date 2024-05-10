import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { StockType } from "../../models/stockTypeSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const deleteStockType = async (req, res) => {
  let { stockTypeId, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockTypeId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockTypeId)) {
    return ResponseHandler(res, "stockType", 402, lang);
  }

  try {
    const stockType = await StockType.findByIdAndDelete(stockTypeId);

    if (!stockType) {
      return ResponseHandler(res, "stockType", 404, lang);
    }

    return ResponseHandler(res, "common", 203, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { deleteStockType };
