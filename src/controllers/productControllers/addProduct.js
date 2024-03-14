import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import { isArr } from "../../utils/validate.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { ProductCategory } from "../../models/productCategorySchema.js";
import { Product } from "../../models/productSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addProduct = async (req, res) => {
  let { productName, description, tags, productCategoryId, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!tags || !productName || !description || !productCategoryId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(productCategoryId)) {
    return ResponseHandler(res, "productCategory", 402, lang);
  }

  if (!Array.isArray(productName)) {
    return ResponseHandler(res, "product", 401, lang);
  }

  if (!Array.isArray(description)) {
    return ResponseHandler(res, "product", 403, lang);
  }

  if (!isArr(tags, "string")) {
    return ResponseHandler(res, "product", 405, lang);
  }

  if (tags.length == 0) {
    return ResponseHandler(res, "product", 406, lang);
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
    const productCategory = await ProductCategory.findById(
      productCategoryId
    ).populate("stockItem");

    let price;
    let additionalPrice = productCategory?.additionalPrice;
    let stockItemPrice = productCategory?.stockItem?.price;

    if (additionalPrice && stockItemPrice) {
      price =
        productCategory?.additionalPrice + productCategory?.stockItem?.price;
    } else {
      price = 0;
    }

    const product = await Product.create({
      name,
      description: desc,
      productCategory: productCategoryId,
      tags,
      price,
    });

    return ResponseHandler(res, "common", 200, lang, product);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { addProduct };
