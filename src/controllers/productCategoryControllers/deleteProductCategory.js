import { ProductCategory } from "../../models/productCategorySchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";
import { ObjectId } from "bson";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const deleteProductCategory = async (req, res) => {
  let { productCategoryId, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!productCategoryId) {
    return res.status(400).json({
      message: language[lang].response[400],
    });
  }

  if (!ObjectId.isValid(productCategoryId)) {
    return res.status(400).json({ message: language[lang].response[430] });
  }

  try {
    const productCategory = await ProductCategory.findByIdAndDelete(
      productCategoryId
    );

    if (!productCategory) {
      return res.status(404).json({ message: language[lang].response[431] });
    }
    return res.status(200).json({
      message: language[lang].response[204],
    });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { deleteProductCategory };
