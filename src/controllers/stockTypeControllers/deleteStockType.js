import { StockType } from "../../models/stockTypeSchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const deleteStockType = async (req, res) => {
  let { id, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }
  if (!id) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(id)) {
    return ErrorHandler(res, 425, lang);
  }

  try {
    const stockType = await StockType.findByIdAndDelete(id);

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
