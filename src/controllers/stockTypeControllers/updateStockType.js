import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import { isArr } from "../../utils/validate.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { StockType } from "../../models/stockTypeSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateStockType = async (req, res) => {
  let { stockTypeName, stockTypeId, images, stockVarities, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockTypeId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (stockTypeName && !isArr(stockTypeName, "object")) {
    return ResponseHandler(res, "stockType", 401, lang);
  }

  if (!isValidObjectId(stockTypeId)) {
    return ResponseHandler(res, "stockType", 402, lang);
  }

  if (!Array.isArray(stockTypeName)) {
    return ResponseHandler(res, "stockType", 408, lang);
  }

  if (stockVarities && !isArr(stockVarities, "string")) {
    return ResponseHandler(res, "stockVariety", 408, lang);
  }

  if (stockVarities) {
    stockVarities.forEach((item) => {
      if (!isValidObjectId(item)) {
        return ResponseHandler(res, "stockType", 402, lang);
      }
    });
  }

  if (images && !isArr(images, "string")) {
    return ResponseHandler(res, "image", 407, lang);
  }

  let name = {};

  stockTypeName &&
    stockTypeName?.forEach((item) => {
      if (
        !(item instanceof Object && item.constructor === Object) ||
        !item.lang ||
        !item.value
      ) {
        return ResponseHandler(res, "stockType", 401, lang);
      }

      name[item.lang] = item.value;
    });

  try {
    const stockType = await StockType.findById(stockTypeId);

    if (!stockType) {
      return ResponseHandler(res, "stockType", 404, lang);
    }

    Array.from(Object.keys(name)).forEach((key) => {
      stockType.name.set(key, name[key]);
    });

    if (stockVarities) stockType.availableVarieties = stockVarities;
    if (images) stockType.images = images;

    await stockType.save();

    return ResponseHandler(res, "common", 202, lang, stockType);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { updateStockType };
