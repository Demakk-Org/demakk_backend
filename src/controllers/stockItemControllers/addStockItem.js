import { StockItem } from "../../models/stockItemSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addStockItem = async (req, res) => {
  let { stockTypeId, stockItemName, price, costToProduce, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockTypeId || !stockItemName || !price || !costToProduce) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(stockTypeId)) {
    return ErrorHandler(res, 425, lang);
  }

  let name = {};

  if (!Array.isArray(stockItemName)) {
    return ErrorHandler(res, 438, lang);
  }

  stockItemName.forEach((item) => {
    if (
      !(item instanceof Object && item.constructor === Object) ||
      !item.lang ||
      !item.value
    ) {
      return ErrorHandler(res, 438, lang);
    }

    name[item.lang] = item.value;
  });

  if (typeof price !== "number" || typeof costToProduce !== "number") {
    return ErrorHandler(res, 443, lang);
  }

  try {
    const stockItem = await StockItem.create({
      stockType: stockTypeId,
      name,
      price,
      costToProduce,
    });

    return ErrorHandler(res, 201, lang, stockItem);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { addStockItem };
