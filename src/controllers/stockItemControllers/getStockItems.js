import { config } from "dotenv";
import response from "../../../response.js";
import { StockItem } from "../../models/stockItemSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getStockItems = (req, res) => {
  let { lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  StockItem.find({})
    .populate("stockType", "name")
    .then((data) => {
      console.log(data);
      let stockItemList = [];
      data.forEach((stockItem) => {
        stockItemList.push({
          id: stockItem._id,
          name: stockItem.name.get(lang)
            ? stockItem.name.get(lang)
            : stockItem.name.get(LANG)
            ? stockItem.name.get(LANG)
            : stockItem.name.get("en"),
          stockType: stockItem.stockType && {
            id: stockItem.stockType._id,
            name: stockItem.stockType.name.get(lang)
              ? stockItem.stockType.name.get(lang)
              : stockItem.stockType.name.get(LANG)
              ? stockItem.stockType.name.get(LANG)
              : stockItem.stockType.name.get("en"),
          },
        });
      });
      return ErrorHandler(res, 200, lang, stockItemList);
    })
    .catch((err) => {
      console.log(err.message);
      return ErrorHandler(res, 500, lang);
    });
};

export { getStockItems };
