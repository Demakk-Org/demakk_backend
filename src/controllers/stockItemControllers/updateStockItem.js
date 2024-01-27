import { StockItem } from "../../models/stockItemSchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const updateStockItem = async (req, res) => {
  let { stockItemId, stockTypeId, name, price, costToProduce, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!stockItemId) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (
    typeof stockItemId !== "string" ||
    (stockTypeId && typeof stockTypeId !== "string") ||
    (name && !(name instanceof Object && name.constructor === Object)) ||
    (price && typeof price !== "number") ||
    (costToProduce && typeof costToProduce !== "number") ||
    (!stockTypeId && !name && !price && !costToProduce)
  ) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  try {
    const stockItem = await StockItem.findById(stockItemId);

    if (!stockItem) {
      return res.status(404).json({ message: language[lang].response[404] });
    }

    if (stockTypeId) stockItem.stockType = stockTypeId;
    if (name) stockItem.name.set(name["lang"], name["value"]);
    if (price) stockItem.price = price;
    if (costToProduce) stockItem.costToProduce = costToProduce;
    await stockItem.save();

    return res
      .status(201)
      .json({ stockItem, message: language[lang].response[201] });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { updateStockItem };
