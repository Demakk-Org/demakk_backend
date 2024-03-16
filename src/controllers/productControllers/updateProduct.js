import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import { isArr } from "../../utils/validate.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { Product } from "../../models/productSchema.js";

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
    return ResponseHandler(res, "product", 402, lang);
  }

  if (productCategoryId && !isValidObjectId(productCategoryId)) {
    return ResponseHandler(res, "productCategory", 402, lang);
  }

  if (productName && !Array.isArray(productName)) {
    return ResponseHandler(res, "product", 401, lang);
  }

  if (description && !Array.isArray(description)) {
    return ResponseHandler(res, "product", 403, lang);
  }

  if (tags && !isArr(tags, "string")) {
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
      return ResponseHandler(res, "product", 403, lang);
    }
    desc[item.lang] = item.value;
  });

  try {
    const product = await Product.findById(productId);

    if (!product) {
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
