import { Product } from "../../models/productSchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";
import { isValidObjectId } from "mongoose";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const updateProduct = async (req, res) => {
  let { productId, name, description, productCategoryId, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!productId) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (!name && !description && !productCategoryId) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (!isValidObjectId(productId)) {
    return res.status(400).json({ message: language[lang].response[432] });
  }

  if (!isValidObjectId(productCategoryId)) {
    return res.status(400).json({ message: language[lang].response[430] });
  }

  if (
    (name && !(name instanceof Object && name.constructor === Object)) ||
    !name.lang ||
    !name.value
  ) {
    return res.status(400).json({ message: language[lang].response[441] });
  }

  if (
    (description &&
      !(description instanceof Object && description.constructor === Object)) ||
    !description.lang ||
    !description.value
  ) {
    return res.status(400).json({ message: language[lang].response[442] });
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: language[lang].response[404] });
    }

    if (productCategoryId) product.productCategory = productCategoryId;
    if (name) product.name.set(name["lang"], name["value"]);
    if (description)
      product.description.set(description["lang"], description["value"]);

    await product.save();
    return res
      .status(201)
      .json({ message: language[lang].response[201], product });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { updateProduct };
