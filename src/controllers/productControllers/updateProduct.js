import { Product } from "../../models/productSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isArr } from "../../utils/validate.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateProduct = async (req, res) => {
  let { productId, productName, description, tags, productCategoryId, lang } =
    req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!productId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!productName && !description && !productCategoryId && !tags) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(productId)) {
    return ErrorHandler(res, 432, lang);
  }

  if (productCategoryId && !isValidObjectId(productCategoryId)) {
    return ErrorHandler(res, 430, lang);
  }

  if (productName && !Array.isArray(productName)) {
    return ErrorHandler(res, 441, lang);
  }

  if (description && !Array.isArray(description)) {
    return ErrorHandler(res, 442, lang);
  }

  if (tags && !isArr(tags, "string")) {
    return ErrorHandler(res, 460, lang);
  }

  let name = {};
  let desc = {};

  productName?.forEach((item) => {
    if (
      !(item instanceof Object && item.constructor === Object) ||
      !item.lang ||
      !item.value
    ) {
      return ErrorHandler(res, 441, lang);
    }
    name[item.lang] = item.value;
  });

  description?.forEach((item) => {
    if (
      !(item instanceof Object && item.constructor === Object) ||
      !item.lang ||
      !item.value
    ) {
      return ErrorHandler(res, 442, lang);
    }
    desc[item.lang] = item.value;
  });

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return ErrorHandler(res, 404, lang);
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
    return ErrorHandler(res, 201, lang, product);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { updateProduct };
