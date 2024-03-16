import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { StockItem } from "../../models/stockItemSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateStockItem = async (req, res) => {
  let { stockItemId, stockTypeId, stockItemName, price, costToProduce, lang } =
    req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockItemId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!stockTypeId && !stockItemName && !price && !costToProduce) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockItemId)) {
    return ResponseHandler(res, "stockItem", 402, lang);
  }

  if (stockTypeId && !isValidObjectId(stockTypeId)) {
    return ResponseHandler(res, "stockType", 402, lang);
  }

  if (stockItemName && !Array.isArray(stockItemName)) {
    return ResponseHandler(res, "stockItem", 401, lang);
  }

  let name = {};

  stockItemName?.forEach((item) => {
    if (
      !(item instanceof Object && item.constructor === Object) ||
      !item.lang ||
      !item.value
    ) {
      return ResponseHandler(res, "stockItem", 401, lang);
    }

    name[item.lang] = item.value;
  });

  if (
    (price && typeof price !== "number") ||
    (costToProduce && typeof costToProduce !== "number")
  ) {
    return ResponseHandler(res, "common", 407, lang);
  }

  try {
    const stockItem = await StockItem.findById(stockItemId);

    if (!stockItem) {
      return ResponseHandler(res, "stockItem", 404, lang);
    }

    if (stockTypeId) stockItem.stockType = stockTypeId;
    if (stockItemName) {
      Array.from(Object.keys(name)).forEach((key) => {
        stockItem.name.set(key, name[key]);
      });
    }
    if (price) stockItem.price = price;
    if (costToProduce) stockItem.costToProduce = costToProduce;
    await stockItem.save();

    return ResponseHandler(res, "common", 202, lang, stockItem);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { updateStockItem };
