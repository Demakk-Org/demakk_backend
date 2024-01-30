import { config } from "dotenv";
import { Product } from "../../models/productSchema.js";
import language from "../../../language.js";

const { LANG, LIMIT, PAGE, SORT } = config(process.cwd, ".env").parsed;

const getProducts = async (req, res) => {
  let { page, limit, lang, sort } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (sort === undefined) sort = SORT;
  if (page === undefined) page = PAGE;
  if (limit === undefined) limit = LIMIT;

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

  const count = await Product.countDocuments(query);

  try {
    Product.find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort(sort)
      .populate({
        path: "productCategory",
        populate: {
          path: "productItem",
          populate: {
            path: "stockItem",
            populate: "stockType",
          },
        },
      })
      .then((data) => {
        let products = [];
        data.forEach((product) => {
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
            productCategory: {
              id: product.productCategory?._id,
              name: product.productCategory?.name.get(lang)
                ? product.productCategory?.name.get(lang)
                : product.productCategory?.name.get(LANG)
                ? product.productCategory?.name.get(LANG)
                : product.productCategory?.name.get("en"),
              additionalPrice: product.productCategory.additionalPrice,
              additionalCost: product.productCategory.additionalCost,
              stockItem: {
                id: product.productCategory.stockItem._id,
                name: product.productCategory.stockItem.name.get(lang)
                  ? product.productCategory.stockItem.name.get(lang)
                  : product.productCategory.stockItem.name.get(LANG)
                  ? product.productCategory.stockItem.name.get(LANG)
                  : product.productCategory.stockItem.name.get("en"),
                stockType: {
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
              },
            },
          };
          products.push(productItem);
        });
        return res.status(200).json({
          page: page.toString(),
          pages: Math.ceil(count / limit).toString(),
          limit: limit.toString(),
          count: count.toString(),
          data: products,
        });
      });
  } catch (err) {
    return res.status(500).json({ error: language[lang].response[500] });
  }
};

export { getProducts };
