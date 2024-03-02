import { StockType } from "../../models/stockTypeSchema.js";
import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isArr } from "../../utils/validate.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addStockType = async (req, res) => {
  let { stockTypeName, images, stockVarieties, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!stockTypeName) {
    return ErrorHandler(res, 400, lang);
  }

  if (!Array.isArray(stockTypeName)) {
    return ErrorHandler(res, 423, lang);
  }

  if (!isArr(images, "string")) {
    return ErrorHandler(res, 491, lang);
  }

  if (!isArr(stockVarieties, "string")) {
    return ErrorHandler(res, 495, lang);
  }

  let name = {};

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
    const stockType = await StockType.create({ name, images, stockVarieties });
    return ErrorHandler(res, 201, lang, stockType);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { addStockType };
