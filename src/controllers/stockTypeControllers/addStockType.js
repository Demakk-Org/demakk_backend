import { StockType } from "../../models/stockTypeSchema.js";
import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addStockType = async (req, res) => {
  let { stockTypeName, lang } = req.body;

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
    const stockType = await StockType.create({ name });
    return ErrorHandler(res, 201, lang, stockType);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { addStockType };
