import { config } from "dotenv";
import Jwt from "jsonwebtoken";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { Product } from "../../models/productSchema.js";

const { LANG, LIMIT, PAGE, SORT } = config(process.cwd, ".env").parsed;

const getProducts = async (req, res) => {
  let { page, limit, lang, sort, productIds } = req.query;

  const token = req.headers?.authorization?.split(" ")[1];
  console.log(typeof page, page, limit, lang, sort, productIds, " params");

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (token) {
    lang = Jwt.decode(token, "your_secret_key")?.lang;
  }

  if (sort === undefined) sort = SORT;
  if (page === undefined || typeof (page * 1) !== "number") page = PAGE;
  if (limit === undefined || typeof (limit * 1) !== "number") limit = LIMIT;

  let query = {};

  if (productIds == "empty") {
    query._id = { $in: [] };
  } else if (productIds) {
    query._id = { $in: productIds.split(",") };
  }

  console.log(query);

  Array.from(Object.keys(req.query)).forEach((item) => {
    if (
      item != null &&
      item != "page" &&
      item != "limit" &&
      item != "lang" &&
      item != "sort" &&
      item != "productIds"
    ) {
      query[item] = req.query[item];
    }
  });

  try {
    const count = await Product.countDocuments(query);

    Product.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("images")
      .then((response) => {
        let products = [];
        response.forEach((product) => {
          let productItem = {
            _id: product._id,
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
            popularity: product.popularity,
            images: product.images,
            rating: product.rating,
            reviews: product.reviews,
            sold: product.sold,
            price: product.price,
            productCategory: product?.productCategory,
            productVariants: product?.productVariants,
          };
          products.push(productItem);
        });

        const data = {
          page: page.toString(),
          pages: Math.ceil(count / limit).toString(),
          limit: limit.toString(),
          count: count.toString(),
          list: products,
        };

        return ResponseHandler(res, "common", 200, lang, { products: data });
      });
  } catch (err) {
    console.log(err.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { getProducts };
