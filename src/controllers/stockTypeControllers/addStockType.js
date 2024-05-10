import { config } from "dotenv";

import { isArr } from "../../utils/validate.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { StockType } from "../../models/stockTypeSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addStockType = async (req, res) => {
  let { stockTypeName, stockVarieties, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockTypeName) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!Array.isArray(stockTypeName)) {
    return ResponseHandler(res, "stockType", 401, lang);
  }

  if (stockVarieties && !isArr(stockVarieties, "string")) {
    return ResponseHandler(res, "stockVariety", 408, lang);
  }

  let name = {};

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
    const stockType = await StockType.create({
      name,
      availableVarieties: stockVarieties,
    });

    return ResponseHandler(res, "common", 201, lang, stockType);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { addStockType };
