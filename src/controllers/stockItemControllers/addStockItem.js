import { StockItem } from "../../models/stockItemSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addStockItem = async (req, res) => {
  let { stockTypeId, stockItemName, price, costToProduce, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockTypeId || !stockItemName || !price || !costToProduce) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockTypeId)) {
    //return ErrorHandler(res, 425, lang);
    return ResponseHandler(res, "stockType", 402, lang);
  }

  let name = {};

  if (!Array.isArray(stockItemName)) {
    //return ErrorHandler(res, 438, lang);
    return ResponseHandler(res, "stockType", 408, lang);
  }

  stockItemName.forEach((item) => {
    if (
      !(item instanceof Object && item.constructor === Object) ||
      !item.lang ||
      !item.value
    ) {
      //return ErrorHandler(res, 438, lang);
      return ResponseHandler(res, "stockType", 408, lang);
    }

    name[item.lang] = item.value;
  });

  if (typeof price !== "number" || typeof costToProduce !== "number") {
    //return ErrorHandler(res, 443, lang);
    return ResponseHandler(res, "stockItem", 405, lang);
  }

  try {
    const stockItem = await StockItem.create({
      stockType: stockTypeId,
      name,
      price,
      costToProduce,
    });

    return ResponseHandler(res, "common", 201, lang, stockItem);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { addStockItem };
