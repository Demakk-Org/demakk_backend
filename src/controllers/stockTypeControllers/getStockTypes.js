import { config } from "dotenv";
import language from "../../../language.js";
import { StockType } from "../../models/stockTypeSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getStockTypes = (req, res) => {
  let { lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  StockType.find({})
    .then((data) => {
      let stockTypeList = [];
      console.log(data);
      data.forEach((stockType) => {
        console.log(stockType.name.get(lang));
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
    })
    .catch((err) => {
      console.log(err.message);
      return ErrorHandler(res, 500, lang);
    });
};

export { getStockTypes };
