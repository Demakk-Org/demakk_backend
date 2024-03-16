import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import { ResponseHandler } from "../../utils/responseHandler.js";
import responsse from "../../../responsse.js";
import { ProductCategory } from "../../models/productCategorySchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addProductCategory = async (req, res) => {
  let {
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

  if (
    !stockItemId ||
    !productCategoryName ||
    !additionalPrice ||
    !additionalCost
  ) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockItemId)) {
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
    typeof additionalPrice !== "number" ||
    typeof additionalCost !== "number"
  ) {
    return ResponseHandler(res, "common", 407, lang);
  }

  try {
    const productCategory = await ProductCategory.create({
      stockItem: stockItemId,
      name,
      additionalPrice,
      additionalCost,
    });

    return ResponseHandler(res, "common", 201, lang, productCategory);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { addProductCategory };
