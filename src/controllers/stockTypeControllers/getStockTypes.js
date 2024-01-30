import { config } from "dotenv";
import language from "../../../language.js";
import { StockType } from "../../models/stockTypeSchema.js";

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
      res.status(200).json({
        data: stockTypeList,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: language[lang].response[500],
      });
    });
};

export { getStockTypes };
