import { StockItem } from "../../models/stockItemSchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";
import { ObjectId } from "bson";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const deleteStockItem = async (req, res) => {
  let { stockItemId, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!stockItemId) {
    return res.status(400).json({
      message: language[lang].response[400],
    });
  }

  if (!ObjectId.isValid(stockItemId)) {
    return res.status(400).json({ message: language[lang].response[428] });
  }

  try {
    const stockItem = await StockItem.findByIdAndDelete(stockItemId);

    if (!stockItem) {
      return res.status(404).json({ message: language[lang].response[429] });
    }

    return res.status(200).json({ message: language[lang].response[204] });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { deleteStockItem };
