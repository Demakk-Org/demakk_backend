import ProductCategory from "../../models/productCategorySchema.js";
import language from "../../../language.json" assert { type: "json" };
import dotenv from "dotenv";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const deleteProductCategory = async (req, res) => {
  let { productCategoryId, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!productCategoryId || typeof productCategoryId !== "string") {
    return res.status(400).json({
      message: language[lang].response[400],
    });
  }

  try {
    const productCategory = await ProductCategory.findByIdAndDelete(
      productCategoryId
    );

    if (!productCategory) {
      return res.status(404).json({ message: language[lang].response[404] });
    }
    return res.status(200).json({
      productCategory,
      message: language[lang].response[200],
    });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { deleteProductCategory };
