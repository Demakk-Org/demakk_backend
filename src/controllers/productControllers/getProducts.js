import { config } from "dotenv";
import { Product } from "../../models/productSchema.js";
import language from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";

const { LANG, LIMIT, PAGE, SORT } = config(process.cwd, ".env").parsed;

const getProducts = async (req, res) => {
  let { page, limit, lang, sort } = req.body;

  if (!lang || !(lang in language)) {
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

  console.log(query);

  try {
    const count = await Product.countDocuments(query);

    Product.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sort)
      .populate({
        path: "productCategory",
        populate: {
          path: "stockItem",
          populate: "stockType",
        },
      })
      .then((response) => {
        console.log(response);
        let products = [];
        response.forEach((product) => {
          let productItem = {
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
            tags: product.tags,
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
                  name: product.productCategory.stockItem.stockType.name.get(
                    lang
                  )
                    ? product.productCategory.stockItem.stockType.name.get(lang)
                    : product.productCategory.stockItem.stockType.name.get(LANG)
                    ? product.productCategory.stockItem.stockType.name.get(LANG)
                    : product.productCategory.stockItem.stockType.name.get(
                        "en"
                      ),
                },
                price: product.productCategory.stockItem.price,
                // costToProduce: product.productCategory.stockItem.costToProduce,
              },
            },
          };
          products.push(productItem);
        });

        const data = {
          page: page.toString(),
          pages: Math.ceil(count / limit).toString(),
          limit: limit.toString(),
          count: count.toString(),
          data: products,
        };

        return ErrorHandler(res, 200, lang, data);
      });
  } catch (err) {
    console.log(err.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { getProducts };
