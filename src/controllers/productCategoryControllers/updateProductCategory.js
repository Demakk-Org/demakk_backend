import { ProductCategory } from "../../models/productCategorySchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";
import { isValidObjectId } from "mongoose";

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

  if (!isValidObjectId(productCategoryId)) {
    return res.status(400).json({ message: language[lang].response[437] });
  }

  if (!stockItemId && !name && !additionalPrice && !additionalCost) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (stockItemId && !isValidObjectId(stockItemId)) {
    return res.status(400).json({ message: language[lang].response[428] });
  }

  if (
    name &&
    (!(name instanceof Object && name.constructor === Object) ||
      !name.lang ||
      !name.value)
  ) {
    return res.status(400).json({ message: language[lang].response[440] });
  }

  if (
    (additionalPrice && typeof additionalPrice !== "number") ||
    (additionalCost && typeof additionalCost !== "number")
  ) {
    return res.status(400).json({ message: language[lang].response[439] });
  }

  try {
    const productCategory = await ProductCategory.findById(productCategoryId);
    if (!productCategory) {
      return res.status(404).json({ message: language[lang].response[431] });
    }

    if (stockItemId) productCategory.stockItem = stockItemId;
    if (name) productCategory.name.set(name["lang"], name["value"]);
    if (additionalPrice) productCategory.additionalPrice = additionalPrice;
    if (additionalCost) productCategory.additionalCost = additionalCost;
    await productCategory.save();

    return res.status(201).json({
      message: language[lang].response[203],
      productCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { updateProductCategory };
