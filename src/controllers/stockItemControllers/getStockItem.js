import { config } from "dotenv";
import response from "../../../response.js";
import { StockItem } from "../../models/stockItemSchema.js";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getStockItem = (req, res) => {
  let stockItemId = req.params.id;
  let { lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (!stockItemId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockItemId)) {
    return ResponseHandler(res, "common", 402, lang);
  }

  try {
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
          stockType: data.stockType && {
            id: data.stockType._id,
            name: data.stockType.name.get(lang)
              ? data.stockType.name.get(lang)
              : data.stockType.name.get(LANG)
              ? data.stockType.name.get(LANG)
              : data.stockType.name.get("en"),
          },
        };

        return ResponseHandler(res, "common", 200, lang, stockItemList);
      });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { getStockItem };
