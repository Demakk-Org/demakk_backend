import { Product } from "../../models/productSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isArr } from "../../utils/validate.js";
import { ProductCategory } from "../../models/productCategorySchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addProduct = async (req, res) => {
  let { productName, description, tags, productCategoryId, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!tags || !productName || !description || !productCategoryId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(productCategoryId)) {
    return ErrorHandler(res, 437, lang);
  }

  if (!Array.isArray(productName)) {
    return ErrorHandler(res, 441, lang);
  }

  if (!Array.isArray(description)) {
    return ErrorHandler(res, 442, lang);
  }

  if (!isArr(tags, "string")) {
    return ErrorHandler(res, 460, lang);
  }

  if (tags.length == 0) {
    return ErrorHandler(res, 480, lang);
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

    return ErrorHandler(res, 200, lang, product);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { addProduct };
