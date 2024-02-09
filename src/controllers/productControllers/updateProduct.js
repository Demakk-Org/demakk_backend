import { Product } from "../../models/productSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateProduct = async (req, res) => {
  let { productId, name, description, tag, productCategoryId, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!productId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!name && !description && !productCategoryId && !tag) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(productId)) {
    return ErrorHandler(res, 432, lang);
  }

  if (productCategoryId && !isValidObjectId(productCategoryId)) {
    return ErrorHandler(res, 430, lang);
  }

  if (
    name &&
    (!(name instanceof Object && name.constructor === Object) ||
      !name.lang ||
      !name.value)
  ) {
    return ErrorHandler(res, 441, lang);
  }

  if (
    description &&
    (!(description instanceof Object && description.constructor === Object) ||
      !description.lang ||
      !description.value)
  ) {
    return ErrorHandler(res, 442, lang);
  }

  if (tag && !Array.isArray(tag)) {
    return ErrorHandler(res, 460, lang);
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return ErrorHandler(res, 404, lang);
    }

    if (productCategoryId) product.productCategory = productCategoryId;
    if (name) product.name.set(name["lang"], name["value"]);
    if (description)
      product.description.set(description["lang"], description["value"]);
    if (tag) product.tags = tag;

    await product.save();
    return ErrorHandler(res, 201, lang, product);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { updateProduct };
