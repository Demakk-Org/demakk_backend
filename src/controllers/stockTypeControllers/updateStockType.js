import { StockType } from "../../models/stockTypeSchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const updateStockType = async (req, res) => {
  let { stockTypeName, id, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!stockTypeName || !id) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(id)) {
    return ErrorHandler(res, 425, lang);
  }

  if (
    (!(stockTypeName instanceof Object) &&
      stockTypeName.constructor === Object) ||
    !stockTypeName.lang ||
    !stockTypeName.value
  ) {
    return ErrorHandler(res, 423, lang);
  }

  try {
    const stockType = await StockType.findById(id);

    if (!stockType) {
      return ErrorHandler(res, 424, lang);
    }

    stockType.name.set(stockTypeName["lang"], stockTypeName["value"]);
    await stockType.save();

    return ErrorHandler(res, 203, lang, stockType);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { updateStockType };
