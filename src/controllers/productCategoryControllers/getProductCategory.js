import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { ProductCategory } from "../../models/productCategorySchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const getProductCategory = (req, res) => {
  let productCategoryId = req.params.id;
  let { lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (!productCategoryId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(productCategoryId)) {
    return ResponseHandler(res, "productCategory", 402, lang);
  }

  try {
    ProductCategory.findById(productCategoryId)
      .populate({
        path: "stockItem",
        populate: "stockType",
      })
      .then((data) => {
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

        return ResponseHandler(res, "common", 200, lang, productCategory);
      });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { getProductCategory };
