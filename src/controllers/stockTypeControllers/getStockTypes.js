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
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: language[lang].response[500],
      });
    });
};

export default getStockTypes;
