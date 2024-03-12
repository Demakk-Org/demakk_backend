import { StockType } from "../../models/stockTypeSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

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
    //return ErrorHandler(res, 425, lang);
    return ResponseHandler(res, "stockType", 402, lang);
  }

  try {
    const stockType = await StockType.findByIdAndDelete(stockTypeId);

    if (!stockType) {
      //return ErrorHandler(res, 424, lang);
      return ResponseHandler(res, "stockType", 404, lang);
    }

    //return ErrorHandler(res, 204, lang);
    return ResponseHandler(res, "common", 203, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { deleteStockType };
