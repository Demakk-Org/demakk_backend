import { StockType } from "../../models/stockTypeSchema.js";
import dotenv from "dotenv";
import language from "../../../language.js";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const addStockType = async (req, res) => {
  let { stockTypeName, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!stockTypeName) {
    return ErrorHandler(res, 400, lang);
  }

  if (
    !(stockTypeName instanceof Object) ||
    // stockTypeName.constructor === Object &&
    !stockTypeName.lang ||
    !stockTypeName.value
  ) {
    return ErrorHandler(res, 423, lang);
  }

  try {
    const stockType = await StockType.create({
      name: { [stockTypeName["lang"]]: stockTypeName["value"] },
    });
    return ErrorHandler(res, 201, lang, { data: stockType });
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { addStockType };
