import { Product } from "../../models/productSchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";
import { isValidObjectId } from "mongoose";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const addProduct = async (req, res) => {
  let { name, description, productCategoryId, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!name || !description || !productCategoryId) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (!isValidObjectId(productCategoryId)) {
    return res.status(400).json({ message: language[lang].response[437] });
  }

  if (
    !(name instanceof Object && name.constructor === Object) ||
    !name.lang ||
    !name.value
  ) {
    return res.status(400).json({ message: language[lang].response[440] });
  }

  if (
    !(description instanceof Object && description.constructor === Object) ||
    !description.lang ||
    !description.value
  ) {
    return res.status(400).json({ message: language[lang].response[442] });
  }

  try {
    const product = await Product.create({
      name,
      productCategory: productCategoryId,
      description,
    });

    return res
      .status(201)
      .json({ message: language[lang].response[201], product });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { addProduct };
