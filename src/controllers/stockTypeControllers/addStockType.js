import { StockType } from "../../models/stockTypeSchema.js";
import dotenv from "dotenv";
import language from "../../../language.js";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const addStockType = async (req, res) => {
  let { stockTypeName, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (
    !stockTypeName ||
    !(stockTypeName instanceof Object && stockTypeName.constructor === Object)
  ) {
    return res.status(400).json({
      message: language[lang].response[400],
    });
  }

  try {
    const stockType = await StockType.create({ name: stockTypeName });
    return res
      .status(201)
      .json({ stockType, message: language[lang].response[201] });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[200] });
  }
};

export { addStockType };
