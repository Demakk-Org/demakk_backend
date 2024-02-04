import { StockItem } from "../../models/stockItemSchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const addStockItem = async (req, res) => {
  let { stockTypeId, name, price, costToProduce, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!stockTypeId || !name || !price || !costToProduce) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(stockTypeId)) {
    return ErrorHandler(res, 425, lang);
  }

  if (
    !(name instanceof Object) ||
    // name.constructor === Object &&
    !name.lang ||
    !name.value
  ) {
    return ErrorHandler(res, 438, lang);
  }

  if (typeof price !== "number" || typeof costToProduce !== "number") {
    return ErrorHandler(res, 439, lang);
  }

  try {
    const stockItem = await StockItem.create({
      stockType: stockTypeId,
      name: { [name.lang]: name.value },
      price,
      costToProduce,
    });

    return ErrorHandler(res, 201, lang, stockItem);
  } catch (error) {
    return ErrorHandler(res, 500, lang);
  }
};

export { addStockItem };
