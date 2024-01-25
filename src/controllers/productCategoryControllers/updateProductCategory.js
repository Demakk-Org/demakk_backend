import ProductCategory from "../../models/productCategorySchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const updateProductCategory = async (req, res) => {
  let {
    productCategoryId,
    stockItemId,
    name,
    additionalPrice,
    additionalCost,
    lang,
  } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!productCategoryId) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (
    typeof productCategoryId !== "string" ||
    (stockItemId && typeof stockItemId !== "string") ||
    (additionalPrice && typeof additionalPrice !== "number") ||
    (additionalCost && typeof additionalCost !== "number") ||
    (name && !(name instanceof Object && name.constructor === Object)) ||
    (!stockItemId && !name && !additionalPrice && !additionalCost)
  ) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  try {
    const productCategory = await ProductCategory.findById(productCategoryId);
    if (!productCategory) {
      return res.status(404).json({ message: language[lang].response[404] });
    }

    if (stockItemId) productCategory.stockItem = stockItemId;
    if (name) productCategory.name.set(name["lang"], name["value"]);
    if (additionalPrice) productCategory.additionalPrice = additionalPrice;
    if (additionalCost) productCategory.additionalCost = additionalCost;
    await productCategory.save();

    return res.status(201).json({
      productCategory,
      message: language[lang].response[201],
    });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { updateProductCategory };
