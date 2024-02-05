import { ProductCategory } from "../../models/productCategorySchema.js";
import language from "../../../language.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

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
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(productCategoryId)) {
    return ErrorHandler(res, 437, lang);
  }

  if (!stockItemId && !name && !additionalPrice && !additionalCost) {
    return ErrorHandler(res, 400, lang);
  }

  if (stockItemId && !isValidObjectId(stockItemId)) {
    return ErrorHandler(res, 428, lang);
  }

  if (
    name &&
    (!(name instanceof Object && name.constructor === Object) ||
      !name.lang ||
      !name.value)
  ) {
    return ErrorHandler(res, 440, lang);
  }

  if (
    (additionalPrice && typeof additionalPrice !== "number") ||
    (additionalCost && typeof additionalCost !== "number")
  ) {
    return ErrorHandler(res, 443, lang);
  }

  try {
    const productCategory = await ProductCategory.findById(productCategoryId);
    if (!productCategory) {
      return ErrorHandler(res, 431, lang);
    }

    if (stockItemId) productCategory.stockItem = stockItemId;
    if (name) productCategory.name.set(name["lang"], name["value"]);
    if (additionalPrice) productCategory.additionalPrice = additionalPrice;
    if (additionalCost) productCategory.additionalCost = additionalCost;
    await productCategory.save();

    return ErrorHandler(res, 203, lang, productCategory);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { updateProductCategory };
