import { StockType } from "../../models/stockTypeSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const deleteStockType = async (req, res) => {
  let { stockTypeId, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }
  if (!stockTypeId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(stockTypeId)) {
    return ErrorHandler(res, 425, lang);
  }

  try {
    const stockType = await StockType.findByIdAndDelete(stockTypeId);

    if (!stockType) {
      return ErrorHandler(res, 424, lang);
    }

    return ErrorHandler(res, 204, lang);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { deleteStockType };
