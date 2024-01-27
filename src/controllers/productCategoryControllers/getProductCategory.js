import { config } from "dotenv";
import language from "../../../language.js";
import { ProductCategory } from "../../models/productCategorySchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getProductCategories = (req, res) => {
  let { lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  ProductCategory.find({})
    .populate("stockItem")
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: language[lang].response[500],
      });
    });
};

export { getProductCategories };
