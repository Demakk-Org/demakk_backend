import { config } from "dotenv";
import language from "../../../language.js";
import { StockItem } from "../../models/stockItemSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getStockItems = (req, res) => {
  let { lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  StockItem.find({})
    .populate("stockType", "name")
    .then((data) => {
      let stockItemList = [];
      data.forEach((stockItem) => {
        stockItemList.push({
          id: stockItem._id,
          name: stockItem.name.get(lang)
            ? stockItem.name.get(lang)
            : stockItem.name.get(LANG)
            ? stockItem.name.get(LANG)
            : stockItem.name.get("en"),
          stockType: {
            id: stockItem.stockType._id,
            name: stockItem.stockType.name.get(lang)
              ? stockItem.stockType.name.get(lang)
              : stockItem.stockType.name.get(LANG)
              ? stockItem.stockType.name.get(LANG)
              : stockItem.stockType.name.get("en"),
          },
        });
      });
      return res.status(200).json({ data: stockItemList });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: language[lang].response[500],
      });
    });
};

export { getStockItems };
