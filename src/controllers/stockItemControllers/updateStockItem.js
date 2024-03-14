import { StockItem } from "../../models/stockItemSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

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

  if (!isValidObjectId(stockItemId)) {
    //return ErrorHandler(res, 428, lang);
    return ResponseHandler(res, "stockItem", 407, lang);
  }

  if (!stockTypeId && !stockItemName && !price && !costToProduce) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (stockTypeId && !isValidObjectId(stockTypeId)) {
    //return ErrorHandler(res, 425, lang);
    return ResponseHandler(res, "stockType", 402, lang);
  }

  if (stockItemName && !Array.isArray(stockItemName)) {
    //return ErrorHandler(res, 423, lang);// invalid stock type name why?
    return ResponseHandler(res, "stockItem", 401, lang);
  }

  let name = {};

  stockItemName?.forEach((item) => {
    if (
      !(item instanceof Object && item.constructor === Object) ||
      !item.lang ||
      !item.value
    ) {
      //return ErrorHandler(res, 438, lang);
      return ResponseHandler(res, "stockItem", 401, lang);
    }

    name[item.lang] = item.value;
  });

  if (
    (price && typeof price !== "number") ||
    (costToProduce && typeof costToProduce !== "number")
  ) {
    //return ErrorHandler(res, 443, lang);
    return ResponseHandler(res, "stockItem", 405, lang);
  }

  try {
    const stockItem = await StockItem.findById(stockItemId);

    if (!stockItem) {
      //return ErrorHandler(res, 427, lang);
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

    return ResponseHandler(res, "common", 203, lang, stockItem);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { updateStockItem };
