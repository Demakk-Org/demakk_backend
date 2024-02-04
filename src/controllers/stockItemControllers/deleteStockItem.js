import { StockItem } from "../../models/stockItemSchema.js";
import language from "../../../language.js";
import { config } from "dotenv";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const deleteStockItem = async (req, res) => {
  let { stockItemId, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!stockItemId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(stockItemId)) {
    return ErrorHandler(res, 428, lang);
  }

  try {
    const stockItem = await StockItem.findByIdAndDelete(stockItemId);

    if (!stockItem) {
      return ErrorHandler(res, 427, lang);
    }

    return ErrorHandler(res, 204, lang);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { deleteStockItem };
