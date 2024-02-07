import { config } from "dotenv";
import response from "../../../response.js";
import { ProductCategory } from "../../models/productCategorySchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getProductCategory = (req, res) => {
  let productCategoryId = req.params.id;
  let { lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (!productCategoryId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(productCategoryId)) {
    return ErrorHandler(res, 430, lang);
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
      return ErrorHandler(res, 200, lang, productCategory);
    })
    .catch((err) => {
      console.log(err.message);
      return ErrorHandler(res, 500, lang);
    });
};

export { getProductCategory };
