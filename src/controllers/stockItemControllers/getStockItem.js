import { config } from "dotenv";
import language from "../../../language.js";
import { StockItem } from "../../models/stockItemSchema.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getStockItem = (req, res) => {
  let stockItemId = req.params.id;
  let { lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!stockItemId) {
    return res.status(400).json({
      message: language[lang].response[400],
    });
  }

  if (!isValidObjectId(stockItemId)) {
    return res.status(400).json({ message: language[lang].response[428] });
  }

  StockItem.findById(stockItemId)
    .populate("stockType", "name")
    .then((data) => {
      let stockItemList = {
        id: data._id,
        name: data.name.get(lang)
          ? data.name.get(lang)
          : data.name.get(LANG)
          ? data.name.get(LANG)
          : data.name.get("en"),
        stockType: {
          id: data.stockType._id,
          name: data.stockType.name.get(lang)
            ? data.stockType.name.get(lang)
            : data.stockType.name.get(LANG)
            ? data.stockType.name.get(LANG)
            : data.stockType.name.get("en"),
        },
      };
      return res.status(200).json({ data: stockItemList });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: language[lang].response[500],
      });
    });
};

export { getStockItem };
