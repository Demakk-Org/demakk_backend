import { StockType } from "../../models/stockTypeSchema.js";
import language from "../../../language.json" assert { type: "json" };
import dotenv from "dotenv";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const updateStockType = async (req, res) => {
  let { stockTypeName, id, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (
    !stockTypeName ||
    !id ||
    !(stockTypeName instanceof Object && stockTypeName.constructor === Object)
  ) {
    return res.status(400).json({
      message: language[lang].response[400],
    });
  }

  try {
    const stockType = await StockType.findById(id);

    if (!stockType) {
      return res.status(404).json({ message: language[lang].response[404] });
    }

    stockType.name.set(stockTypeName["lang"], stockTypeName["value"]);
    await stockType.save();

    return res
      .status(200)
      .json({ stockType, message: language[lang].response[201] });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { updateStockType };
