import { StockType } from "../../models/stockTypeSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateStockType = async (req, res) => {
  let { stockTypeName, stockTypeId, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockTypeName || !stockTypeId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(stockTypeId)) {
    return ErrorHandler(res, 425, lang);
  }

  if (
    !(
      stockTypeName instanceof Object && stockTypeName.constructor === Object
    ) ||
    !stockTypeName.lang ||
    !stockTypeName.value
  ) {
    return ErrorHandler(res, 423, lang);
  }

  try {
    const stockType = await StockType.findById(stockTypeId);

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
