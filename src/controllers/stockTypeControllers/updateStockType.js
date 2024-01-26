import { StockType } from "../../models/stockTypeSchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const updateStockType = async (req, res) => {
  let { stockTypeName, id, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!stockTypeName || !id) {
    return res.status(400).json({
      message: language[lang].response[400],
    });
  }

  if (
    !(stockTypeName instanceof Object) &&
    stockTypeName.constructor === Object
  ) {
    return res.status(400).json({ message: language[lang].response[423] });
  }

  try {
    const stockType = await StockType.findById(id);

    if (!stockType) {
      return res.status(404).json({ message: language[lang].response[424] });
    }

    stockType.name.set(stockTypeName["lang"], stockTypeName["value"]);
    await stockType.save();

    return res
      .status(200)
      .json({ message: language[lang].response[201], stockType });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { updateStockType };
