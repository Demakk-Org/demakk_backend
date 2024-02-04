import { config } from "dotenv";
import language from "../../../language.js";
import { Product } from "../../models/productSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getProduct = (req, res) => {
  let productId = req.params.id;
  let { lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!productId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(productId)) {
    return ErrorHandler(res, 432, lang);
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
      console.log(product, "------->");
      if (!product) {
        return ErrorHandler(res, 433, lang);
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
          // additionalCost: product.productCategory.additionalCost,
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
            price: product.productCategory.stockItem.price,
            // costToProduce: product.productCategory.stockItem.costToProduce,
          },
        },
      };
      return ErrorHandler(res, 200, lang, data);
    })
    .catch((error) => {
      console.log(error.message);
      return ErrorHandler(res, 500, lang);
    });
};

export { getProduct };
