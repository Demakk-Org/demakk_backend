import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { StockType } from "../../models/stockTypeSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getStockTypes = async (req, res) => {
  let { lang } = req.body;

  if (!lang || !(lang in responsse)) {
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

    return ResponseHandler(res, "common", 200, lang, stockTypeList);
  } catch (error) {
    console.log(err.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { getStockTypes };
