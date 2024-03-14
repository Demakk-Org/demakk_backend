import { Product } from "../../models/productSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isArr } from "../../utils/validate.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateProduct = async (req, res) => {
  let { productId, productName, description, tags, productCategoryId, lang } =
    req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!productId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!productName && !description && !productCategoryId && !tags) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(productId)) {
    //return ErrorHandler(res, 432, lang);
    return ResponseHandler(res, "product", 402, lang);
  }

  if (productCategoryId && !isValidObjectId(productCategoryId)) {
    // return ErrorHandler(res, 430, lang);
    return ResponseHandler(res, "productCategory", 402, lang);
  }

  if (productName && !Array.isArray(productName)) {
    //return ErrorHandler(res, 441, lang);
    return ResponseHandler(res, "product", 401, lang);
  }

  if (description && !Array.isArray(description)) {
    //return ErrorHandler(res, 442, lang);
    return ResponseHandler(res, "product", 403, lang);
  }

  if (tags && !isArr(tags, "string")) {
    //return ErrorHandler(res, 460, lang);
    return ResponseHandler(res, "product", 405, lang);
  }

  let name = {};
  let desc = {};

  productName?.forEach((item) => {
    if (
      !(item instanceof Object && item.constructor === Object) ||
      !item.lang ||
      !item.value
    ) {
      //return ErrorHandler(res, 441, lang);
      return ResponseHandler(res, "product", 401, lang);
    }
    name[item.lang] = item.value;
  });

  description?.forEach((item) => {
    if (
      !(item instanceof Object && item.constructor === Object) ||
      !item.lang ||
      !item.value
    ) {
      //return ErrorHandler(res, 442, lang);
      return ResponseHandler(res, "product", 403, lang);
    }
    desc[item.lang] = item.value;
  });

  try {
    const product = await Product.findById(productId);

    if (!product) {
      //return ErrorHandler(res, 404, lang);
      return ResponseHandler(res, "product", 404, lang);
    }

    if (productCategoryId) product.productCategory = productCategoryId;
    if (productName) {
      Array.from(Object.keys(name)).forEach((key) => {
        product.name.set(key, name[key]);
      });
    }

    if (description) {
      Array.from(Object.keys(desc)).forEach((key) => {
        product.description.set(key, desc[key]);
      });
    }

    if (tags) product.tags = tags;

    await product.save();
    return ResponseHandler(res, "common", 201, lang, product);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { updateProduct };
