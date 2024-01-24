import Product from "../../models/productSchema.js";
import language from "../../../language.json" assert { type: "json" };
import dotenv from "dotenv";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const addProduct = async (req, res) => {
  let { name, description, productCategoryId, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!name || !description || !productCategoryId) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (
    !(description instanceof Object && description.constructor === Object) ||
    !(name instanceof Object && name.constructor === Object) ||
    typeof productCategoryId !== "string"
  ) {
    return res.status(400).json({
      message: language[lang].response[400],
    });
  }

  try {
    const product = await Product.create({
      name,
      productCategory: productCategoryId,
      description,
    });

    return res
      .status(201)
      .json({ product, message: language[lang].response[201] });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { addProduct };
