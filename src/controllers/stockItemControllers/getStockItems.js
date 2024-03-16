import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { StockItem } from "../../models/stockItemSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getStockItems = async (req, res) => {
  let { lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  try {
    const stockItems = await StockItem.find({}).populate("stockType", "name");

    let stockItemList = [];

    stockItems.forEach((stockItem) => {
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

    return ResponseHandler(res, "common", 200, lang, stockItemList);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { getStockItems };
