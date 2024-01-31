import { config } from "dotenv";
import language from "../../../language.js";
import { ObjectId } from "bson";
import { Product } from "../../models/productSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getProduct = (req, res) => {
  let productId = req.params.id;
  let { lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!productId) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (!ObjectId.isValid(productId)) {
    return res.status(400).json({ message: language[lang].response[432] });
  }

  Product.findById(productId)
    .populate({
      path: "productCategory",
      populate: {
        path: "stockItem",
        populate: "stockType",
      },
    })
    .then((product) => {
      console.log(product);
      if (!product) {
        return res.status(404).json({ message: language[lang].response[433] });
      }

      let data = {
        id: product._id,
        name: product.name.get(lang)
          ? product.name.get(lang)
          : product.name.get(LANG)
          ? product.name.get(LANG)
          : product.name.get("en"),
        description: product.description.get(lang)
          ? product.description.get(lang)
          : product.description.get(LANG)
          ? product.description.get(LANG)
          : product.description.get("en"),
        productCategory: product.productCategory && {
          id: product.productCategory._id,
          name: product.productCategory.name.get(lang)
            ? product.productCategory.name.get(lang)
            : product.productCategory.name.get(LANG)
            ? product.productCategory.name.get(LANG)
            : product.productCategory.name.get("en"),
          additionalPrice: product.productCategory.additionalPrice,
          additionalCost: product.productCategory.additionalCost,
          stockItem: product.productCategory.stockItem && {
            id: product.productCategory.stockItem._id,
            name: product.productCategory.stockItem.name.get(lang)
              ? product.productCategory.stockItem.name.get(lang)
              : product.productCategory.stockItem.name.get(LANG)
              ? product.productCategory.stockItem.name.get(LANG)
              : product.productCategory.stockItem.name.get("en"),
            stockType: product.productCategory.stockItem.stockType && {
              id: product.productCategory.stockItem.stockType._id,
              name: product.productCategory.stockItem.stockType.name.get(lang)
                ? product.productCategory.stockItem.stockType.name.get(lang)
                : product.productCategory.stockItem.stockType.name.get(LANG)
                ? product.productCategory.stockItem.stockType.name.get(LANG)
                : product.productCategory.stockItem.stockType.name.get("en"),
            },
          },
        },
      };
      console.log(product);
      return res.status(200).json({ data });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ message: language[lang].response[500] });
    });
};

export { getProduct };
