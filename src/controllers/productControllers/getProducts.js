import { config } from "dotenv";
import Jwt from "jsonwebtoken";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { Product } from "../../models/productSchema.js";

const { LANG, LIMIT, PAGE, SORT } = config(process.cwd, ".env").parsed;

const getProducts = async (req, res) => {
  let { page, limit, lang, sort } = req.body;
  const token = req.headers?.authorization?.split(" ")[1];

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (token) {
    lang = Jwt.decode(token, "your_secret_key")?.lang;
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
            productCategory: product?.productCategory && {
              id: product.productCategory._id,
              name: product.productCategory.name.get(lang)
                ? product.productCategory.name.get(lang)
                : product.productCategory.name.get(LANG)
                ? product.productCategory.name.get(LANG)
                : product.productCategory.name.get("en"),
              additionalPrice: product.productCategory.additionalPrice,
              stockItem: product?.productCategory?.stockItem && {
                id: product.productCategory.stockItem._id,
                name: product.productCategory.stockItem.name.get(lang)
                  ? product.productCategory.stockItem.name.get(lang)
                  : product.productCategory.stockItem.name.get(LANG)
                  ? product.productCategory.stockItem.name.get(LANG)
                  : product.productCategory.stockItem.name.get("en"),
                stockType: product?.productCategory?.stockItem?.stockType && {
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

        return ResponseHandler(res, "common", 200, lang, data);
      });
  } catch (err) {
    console.log(err.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { getProducts };
