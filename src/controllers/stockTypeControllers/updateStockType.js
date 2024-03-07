import { StockType } from "../../models/stockTypeSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isArr } from "../../utils/validate.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateStockType = async (req, res) => {
  let { stockTypeName, stockTypeId, images, stockVarities, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockTypeId) {
    return ErrorHandler(res, 400, lang);
  }

  if (stockTypeName && !isArr(stockTypeName, "object")) {
    return ErrorHandler(res, 423, lang);
  }

  if (!isValidObjectId(stockTypeId)) {
    return ErrorHandler(res, 425, lang);
  }

  if (!Array.isArray(stockTypeName)) {
    return ErrorHandler(res, 423, lang);
  }

  if (stockVarities && !isArr(stockVarities, "string")) {
    return ErrorHandler(res, 495, lang);
  }

  if (stockVarities) {
    stockVarities.forEach((item) => {
      if (!isValidObjectId(item)) {
        return ErrorHandler(res, 425, lang);
      }
    });
  }

  if (images && !isArr(images, "string")) {
    return ErrorHandler(res, 491, lang);
  }

  let name = {};

  stockTypeName &&
    stockTypeName?.forEach((item) => {
      if (
        !(item instanceof Object && item.constructor === Object) ||
        !item.lang ||
        !item.value
      ) {
        return ErrorHandler(res, 423, lang);
      }

      name[item.lang] = item.value;
    });

  try {
    const stockType = await StockType.findById(stockTypeId);

    if (!stockType) {
      return ErrorHandler(res, 424, lang);
    }

    Array.from(Object.keys(name)).forEach((key) => {
      stockType.name.set(key, name[key]);
    });

    if (stockVarities) stockType.availableVarieties = stockVarities;
    if (images) stockType.images = images;

    await stockType.save();

    return ErrorHandler(res, 203, lang, stockType);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { updateStockType };
