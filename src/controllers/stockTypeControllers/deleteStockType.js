import { StockType } from "../../models/stockTypeSchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";
import { ObjectId } from "bson";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const deleteStockType = async (req, res) => {
  let { id, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }
  if (!id) {
    return res.status(400).json({
      message: language[lang].response[400],
    });
  }

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      message: language[lang].response[425],
    });
  }

  try {
    const stockType = await StockType.findByIdAndDelete(id);

    if (!stockType) {
      return res.status(404).json({ message: language[lang].response[424] });
    }

    return res
      .status(200)
      .json({ stockType, message: language[lang].response[204] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { deleteStockType };
