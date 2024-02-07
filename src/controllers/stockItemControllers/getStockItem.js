import { config } from "dotenv";
import response from "../../../response.js";
import { StockItem } from "../../models/stockItemSchema.js";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getStockItem = (req, res) => {
  let stockItemId = req.params.id;
  let { lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (!stockItemId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(stockItemId)) {
    return ErrorHandler(res, 428, lang);
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
      return ErrorHandler(res, 200, lang, stockItemList);
    })
    .catch((err) => {
      console.log(err.message);
      return ErrorHandler(res, 500, lang);
    });
};

export { getStockItem };
