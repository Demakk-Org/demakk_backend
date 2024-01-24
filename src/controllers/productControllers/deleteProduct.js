import Product from "../../models/productSchema.js";
import language from "../../../language.json" assert { type: "json" };
import dotenv from "dotenv";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const deleteProduct = async (req, res) => {
  const { productId, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!productId || typeof productId !== "string") {
    return res.status(400).json({
      message: language[lang].response[400],
    });
  }

  try {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: language[lang].response[404] });
    }
    return res
      .status(200)
      .json({ product, message: language[lang].response[200] });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { deleteProduct };
