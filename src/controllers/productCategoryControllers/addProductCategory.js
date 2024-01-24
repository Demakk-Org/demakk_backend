import ProductCategory from "../../models/productCategorySchema.js";
import language from "../../../language.json" assert { type: "json" };
import dotenv from "dotenv";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const addProductCategory = async (req, res) => {
  let { stockItemId, name, additionalPrice, additionalCost, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (
    !stockItemId ||
    !name ||
    !additionalPrice ||
    !additionalCost ||
    typeof stockItemId !== "string" ||
    !(name instanceof Object && name.constructor === Object) ||
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
      productCategory,
      message: language[lang].response[201],
    });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { addProductCategory };
