import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { ProductCategory } from "../../models/productCategorySchema.js";

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

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!productCategoryId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(productCategoryId)) {
    return ResponseHandler(res, "productCategory", 402, lang);
  }

  if (
    !stockItemId &&
    !productCategoryName &&
    !additionalPrice &&
    !additionalCost
  ) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (stockItemId && !isValidObjectId(stockItemId)) {
    return ResponseHandler(res, "stockItem", 402, lang);
  }

  if (!Array.isArray(productCategoryName)) {
    return ResponseHandler(res, "productCategory", 401, lang);
  }

  let name = {};

  productCategoryName?.forEach((item) => {
    if (
      !(item instanceof Object && item.constructor === Object) ||
      !item.lang ||
      !item.value
    ) {
      return ResponseHandler(res, "productCategory", 401, lang);
    }
    name[item.lang] = item.value;
  });

  if (
    (additionalPrice && typeof additionalPrice !== "number") ||
    (additionalCost && typeof additionalCost !== "number")
  ) {
    return ResponseHandler(res, "common", 407, lang);
  }

  try {
    const productCategory = await ProductCategory.findById(productCategoryId);
    if (!productCategory) {
      return ResponseHandler(res, "productCategory", 404, lang);
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

    return ResponseHandler(res, "common", 202, lang, productCategory);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { updateProductCategory };
