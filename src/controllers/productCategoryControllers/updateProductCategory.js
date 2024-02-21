import { ProductCategory } from "../../models/productCategorySchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateProductCategory = async (req, res) => {
  let {
    productCategoryId,
    stockItemId,
    productCategoryName,
    additionalPrice,
    additionalCost,
    lang,
  } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!productCategoryId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(productCategoryId)) {
    return ErrorHandler(res, 437, lang);
  }

  if (
    !stockItemId &&
    !productCategoryName &&
    !additionalPrice &&
    !additionalCost
  ) {
    return ErrorHandler(res, 400, lang);
  }

  if (stockItemId && !isValidObjectId(stockItemId)) {
    return ErrorHandler(res, 428, lang);
  }

  if (!Array.isArray(productCategoryName)) {
    return ErrorHandler(res, 440, lang);
  }

  let name = {};

  productCategoryName?.forEach((item) => {
    if (
      !(item instanceof Object && item.constructor === Object) ||
      !item.lang ||
      !item.value
    ) {
      return ErrorHandler(res, 440, lang);
    }
    name[item.lang] = item.value;
  });

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
    if (productCategoryName) {
      Array.from(Object.keys(name)).forEach((key) => {
        productCategory.name.set(key, name[key]);
      });
    }
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
