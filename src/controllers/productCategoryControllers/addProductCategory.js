import { ProductCategory } from "../../models/productCategorySchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const addProductCategory = async (req, res) => {
  let { stockItemId, name, additionalPrice, additionalCost, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!stockItemId || !name || !additionalPrice || !additionalCost) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (!isValidObjectId(stockItemId)) {
    return res.status(400).json({ message: language[lang].response[428] });
  }

  if (
    !(name instanceof Object && name.constructor === Object) ||
    !name.lang ||
    !name.value
  ) {
    return res.status(400).json({ message: language[lang].response[440] });
  }

  if (
    typeof additionalPrice !== "number" ||
    typeof additionalCost !== "number"
  ) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  try {
    const productCategory = await ProductCategory.create({
      stockItem: stockItemId,
      name,
      additionalPrice,
      additionalCost,
    });

    return res.status(201).json({
      message: language[lang].response[201],
      productCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { addProductCategory };
