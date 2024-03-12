import { StockItem } from "../../models/stockItemSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const deleteStockItem = async (req, res) => {
  let { stockItemId, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockItemId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockItemId)) {
    //return ErrorHandler(res, 428, lang);
    return ResponseHandler(res, "stockItem", 402, lang);
  }

  try {
    const stockItem = await StockItem.findByIdAndDelete(stockItemId);

    if (!stockItem) {
      //return ErrorHandler(res, 427, lang);
      return ResponseHandler(res, "stockItem", 404, lang);
    }

    return ResponseHandler(res, "common", 203, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { deleteStockItem };
