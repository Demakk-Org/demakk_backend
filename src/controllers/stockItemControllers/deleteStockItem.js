import StockItem from "../../models/stockItemSchema.js";
import language from "../../../language.json" assert { type: "json" };
import dotenv from "dotenv";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const deleteStockItem = async (req, res) => {
  let { stockItemId, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }
  if (!stockItemId || typeof stockItemId !== "string") {
    return res.status(400).json({
      message: language[lang].response[400],
    });
  }

  try {
    const stockItem = await StockItem.findByIdAndDelete(stockItemId);

    if (!stockItem) {
      return res.status(404).json({ message: language[lang].response[404] });
    }

    return res
      .status(200)
      .json({ stockItem, message: language[lang].response[200] });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { deleteStockItem };
