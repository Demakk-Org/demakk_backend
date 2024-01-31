import { StockItem } from "../../models/stockItemSchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";
import { isValidObjectId } from "mongoose";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const addStockItem = async (req, res) => {
  let { stockTypeId, name, price, costToProduce, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!stockTypeId || !name || !price || !costToProduce) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (!isValidObjectId(stockTypeId)) {
    return res.status(400).json({ message: language[lang].response[425] });
  }

  if (
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
    const stockItem = await StockItem.create({
      stockType: stockTypeId,
      name,
      price,
      costToProduce,
    });

    return res
      .status(201)
      .json({ message: language[lang].response[201], stockItem });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { addStockItem };
