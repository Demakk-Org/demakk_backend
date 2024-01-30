import { config } from "dotenv";
import language from "../../../language.js";
import { ProductCategory } from "../../models/productCategorySchema.js";
import { ObjectId } from "bson";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getProductCategory = (req, res) => {
  let productCategoryId = req.params.id;
  let { lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!productCategoryId) {
    return res.status(400).json({
      message: language[lang].response[400],
    });
  }

  if (!ObjectId.isValid(productCategoryId)) {
    return res.status(404).json({ message: language[lang].response[430] });
  }

  ProductCategory.findById(productCategoryId)
    .populate({
      path: "stockItem",
      populate: "stockType",
    })
    .then((data) => {
      console.log(data);
      let productCategory = {
        id: data._id,
        name: data.name.get(lang)
          ? data.name.get(lang)
          : data.name.get(LANG)
          ? data.name.get(LANG)
          : data.name.get("en"),
        additionalPrice: data.additionalPrice,
        additionalCost: data.additionalCost,
        stockItem: data.stockItem && {
          id: data.stockItem._id,
          name: data.stockItem.name.get(lang)
            ? data.stockItem.name.get(lang)
            : data.stockItem.name.get(LANG)
            ? data.stockItem.name.get(LANG)
            : data.stockItem.name.get("en"),
          stockType: data.stockItem.stockType && {
            id: data.stockItem.stockType._id,
            name: data.stockItem.stockType.name.get(lang)
              ? data.stockItem.stockType.name.get(lang)
              : data.stockItem.stockType.name.get(LANG)
              ? data.stockItem.stockType.name.get(LANG)
              : data.stockItem.stockType.name.get("en"),
          },
        },
      };
      return res.status(200).json({ data: productCategory });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: language[lang].response[500],
      });
    });
};

export { getProductCategory };
