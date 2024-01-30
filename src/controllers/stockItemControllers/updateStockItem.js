import { StockItem } from "../../models/stockItemSchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";
import { isValidObjectId } from "mongoose";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const updateStockItem = async (req, res) => {
  let { stockItemId, stockTypeId, name, price, costToProduce, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!stockItemId) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (!stockTypeId && !name && !price && !costToProduce) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (!isValidObjectId(stockItemId)) {
    return res.status(400).json({ message: language[lang].response[428] });
  }

  if (stockTypeId && !isValidObjectId(stockTypeId)) {
    return res.status(400).json({ message: language[lang].response[425] });
  }

  if (
    name &&
    !name instanceof Object &&
    name.constructor === Object &&
    (!name.lang || !name.value)
  ) {
    return res.status(400).json({ message: language[lang].response[438] });
  }

  if (typeof price !== "number" || typeof costToProduce !== "number") {
    return res.status(400).json({ message: language[lang].response[439] });
  }

  try {
    const stockItem = await StockItem.findById(stockItemId);

    if (!stockItem) {
      return res.status(404).json({ message: language[lang].response[427] });
    }

    if (stockTypeId) stockItem.stockType = stockTypeId;
    if (name) stockItem.name.set(name["lang"], name["value"]);
    if (price) stockItem.price = price;
    if (costToProduce) stockItem.costToProduce = costToProduce;
    await stockItem.save();

    return res
      .status(201)
      .json({ message: language[lang].response[203], stockItem });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { updateStockItem };
