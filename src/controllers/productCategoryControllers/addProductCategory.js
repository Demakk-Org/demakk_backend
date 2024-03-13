import { ProductCategory } from "../../models/productCategorySchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

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
    //return ErrorHandler(res, 428, lang);
    return ResponseHandler(res, "stockItem", 402, lang)
  }

  if (!Array.isArray(productCategoryName)) {
    ///return ErrorHandler(res, 440, lang);
    return ResponseHandler(res, "productCategory", 401, lang)
  }

  let name = {};

  productCategoryName?.forEach((item) => {
    if (
      !(item instanceof Object && item.constructor === Object) ||
      !item.lang ||
      !item.value
    ) {
      //return ErrorHandler(res, 440, lang);
      return ResponseHandler(res, "productCategory", 401, lang)
    }

    name[item.lang] = item.value;
  });

  if (
    typeof additionalPrice !== "number" ||
    typeof additionalCost !== "number"
  ) {
    //return ErrorHandler(res, 443, lang);
    return ResponseHandler(res, "product", 407, lang)
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
