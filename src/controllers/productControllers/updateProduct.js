import { Product } from "../../models/productSchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const updateProduct = async (req, res) => {
  let { productId, name, description, productCategoryId, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!productId) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (
    typeof productId !== "string" ||
    (name && !(name instanceof Object && name.constructor === Object)) ||
    (description &&
      !(description instanceof Object && description.constructor === Object)) ||
    (productCategoryId && typeof productCategoryId !== "string") ||
    (!name && !description && !productCategoryId)
  ) {
    return res.status(400).json({ message: language[lang].response[400] });
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
      .json({ product, message: language[lang].response[201] });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { updateProduct };
