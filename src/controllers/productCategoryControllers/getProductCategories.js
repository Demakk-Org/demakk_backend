import { config } from "dotenv";
import response from "../../../response.js";
import { ProductCategory } from "../../models/productCategorySchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const { LANG, SORT, LIMIT, PAGE } = config(process.cwd, ".env").parsed;

const getProductCategories = async (req, res) => {
  let { lang, page, limit, sort } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (sort === undefined) sort = SORT;
  if (page === undefined || typeof page !== "number") page = PAGE;
  if (limit === undefined || typeof limit !== "number") limit = LIMIT;

  let query = {};

  Array.from(Object.keys(req.body)).forEach((item) => {
    if (
      item != null &&
      item != "page" &&
      item != "limit" &&
      item != "lang" &&
      item != "sort"
    ) {
      query[item] = req.body[item];
    }
  });

  let count = await ProductCategory.countDocuments(query);

  try {
    ProductCategory.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sort)
      .populate({
        path: "stockItem",
        populate: "stockType",
      })
      .then((data) => {
        let productCategoryList = [];

        data.forEach((productCategory) => {
          console.log(productCategory);
          let productCategoryItem = {
            id: productCategory._id,
            name: productCategory.name.get(lang)
              ? productCategory.name.get(lang)
              : productCategory.name.get(LANG)
                ? productCategory.name.get(LANG)
                : productCategory.name.get("en"),
            additionalPrice: productCategory.additionalPrice,
            additionalCost: productCategory.additionalCost,
            stockItem: productCategory.stockItem && {
              id: productCategory.stockItem?._id,
              name: productCategory.stockItem?.name.get(lang)
                ? productCategory.stockItem?.name.get(lang)
                : productCategory.stockItem?.name.get(LANG)
                  ? productCategory.stockItem?.name.get(LANG)
                  : productCategory.stockItem?.name.get("en"),
              stockType: productCategory.stockItem.stockType && {
                id: productCategory.stockItem.stockType._id,
                name: productCategory.stockItem.stockType.name.get(lang)
                  ? productCategory.stockItem.stockType.name.get(lang)
                  : productCategory.stockItem.stockType.name.get(LANG)
                    ? productCategory.stockItem.stockType.name.get(LANG)
                    : productCategory.stockItem.stockType.name.get("en"),
              },
            },
          };

          productCategoryList.push(productCategoryItem);
        });

        const productCategories = {
          page: page.toString(),
          pages: Math.ceil(count / limit).toString(),
          limit: limit.toString(),
          count: count.toString(),
          data: productCategoryList,
        };

        return ResponseHandler(res, "common", 200, lang, productCategories);
      });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(err, "common", 500, lang);
  }
};

export { getProductCategories };
