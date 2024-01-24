import { StockType } from "../../models/stockTypeSchema.js";
import language from "../../../language.json" assert { type: "json" };
import dotenv from "dotenv";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const deleteStockType = async (req, res) => {
  const { id, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }
  if (!id || typeof id !== "string") {
    return res.status(400).json({
      message: language[lang].response[400],
    });
  }

  try {
    const stockType = await StockType.findByIdAndDelete(id);

    if (!stockType) {
      return res.status(404).json({ message: language[lang].response[404] });
    }

    return res
      .status(200)
      .json({ stockType, message: language[lang].response[200] });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { deleteStockType };
