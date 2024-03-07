import { config } from "dotenv";
import response from "../../../response.js";
import { StockType } from "../../models/stockTypeSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getStockTypes = async (req, res) => {
  let { lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  try {
    const stockType = await StockType.find({});

    let stockTypeList = [];

    stockType.forEach((stockType) => {
      stockTypeList.push({
        id: stockType._id,
        name: stockType.name.get(lang)
          ? stockType.name.get(lang)
          : stockType.name.get(LANG)
          ? stockType.name.get(LANG)
          : stockType.name.get("en"),
      });
    });

    return ErrorHandler(res, 200, lang, stockTypeList);
  } catch (error) {
    console.log(err.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { getStockTypes };
