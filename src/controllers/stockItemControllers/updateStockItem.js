import { StockItem } from "../../models/stockItemSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateStockItem = async (req, res) => {
  let { stockItemId, stockTypeId, name, price, costToProduce, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (!stockItemId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(stockItemId)) {
    return ErrorHandler(res, 428, lang);
  }

  if (!stockTypeId && !name && !price && !costToProduce) {
    return ErrorHandler(res, 400, lang);
  }

  if (stockTypeId && !isValidObjectId(stockTypeId)) {
    return ErrorHandler(res, 425, lang);
  }

  if (
    (name && !(name instanceof Object && name.constructor === Object)) ||
    !name.lang ||
    !name.value
  ) {
    return ErrorHandler(res, 438, lang);
  }

  if (
    (price && typeof price !== "number") ||
    (costToProduce && typeof costToProduce !== "number")
  ) {
    return ErrorHandler(res, 443, lang);
  }

  try {
    const stockItem = await StockItem.findById(stockItemId);

    if (!stockItem) {
      return ErrorHandler(res, 427, lang);
    }

    if (stockTypeId) stockItem.stockType = stockTypeId;
    if (name) stockItem.name.set(name["lang"], name["value"]);
    if (price) stockItem.price = price;
    if (costToProduce) stockItem.costToProduce = costToProduce;
    await stockItem.save();

    return ErrorHandler(res, 203, lang, stockItem);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { updateStockItem };
