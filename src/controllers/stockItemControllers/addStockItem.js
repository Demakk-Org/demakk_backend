import StockItem from "../../models/stockItemSchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const addStockItem = async (req, res) => {
  let { stockTypeId, name, price, costToProduce, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (
    !stockTypeId ||
    !name ||
    !price ||
    !costToProduce ||
    typeof stockTypeId !== "string" ||
    !(name instanceof Object && name.constructor === Object) ||
    typeof price !== "number" ||
    typeof costToProduce !== "number"
  ) {
    return res.status(400).json({ message: language[lang].response[400] });
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
      .json({ stockItem, message: language[lang].response[201] });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { addStockItem };
