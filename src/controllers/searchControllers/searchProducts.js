import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { Product } from "../../models/productSchema.js";

const { LANG, LIMIT, PAGE, SORT } = config(process.cwd, ".env").parsed;

const searchProducts = async (req, res) => {
  let { page, limit, lang, sort, text, price } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (sort === undefined) sort = SORT;
  if (page === undefined || typeof page !== "number") page = PAGE;
  if (limit === undefined || typeof limit !== "number") limit = LIMIT;

  if (!text) {
    return ErrorHandler(res, 400, lang);
  }

  if (typeof text !== "string") {
    return ErrorHandler(res, 446, lang);
  }

  if (
    price &&
    (!(price instanceof Object && price.constructor === Object) ||
      !price.gte ||
      !price.lt)
  ) {
    return ErrorHandler(res, 443, lang);
  }

  let match = {};

  if (price) {
    match["$match"] = {
      $and: [
        {
          price: {
            $lt: price.lt,
          },
        },
        {
          price: {
            $gte: price.gte,
          },
        },
      ],
    };
  }

  let pipeline = [
    {
      $search: {
        index: "product-index",
        text: {
          query: text,
          path: {
            wildcard: "*",
          },
          fuzzy: {},
        },
      },
    },
    {
      $lookup: {
        from: "productcategories",
        localField: "productCategory",
        foreignField: "_id",
        as: "productCategory",
      },
    },
    {
      $addFields: {
        productCategory: {
          $first: "$productCategory",
        },
      },
    },
    {
      $lookup: {
        from: "stockitems",
        localField: "productCategory.stockItem",
        foreignField: "_id",
        as: "productCategory.stockItem",
      },
    },
    {
      $addFields: {
        "productCategory.stockItem": {
          $first: "$productCategory.stockItem",
        },
      },
    },
    {
      $lookup: {
        from: "stocktypes",
        localField: "productCategory.stockItem.stockType",
        foreignField: "_id",
        as: "productCategory.stockItem.stockType",
      },
    },
    {
      $addFields: {
        "productCategory.stockItem.stockType": {
          $first: "$productCategory.stockItem.stockType",
        },
      },
    },
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: limit * 1,
    },
    {
      $project: {
        _id: 0,
        name: 1,
        description: 1,
        tags: 1,
        productCategory: 1,
        price: 1,
        score: { $meta: "searchScore" },
      },
    },
  ];

  if (price) {
    pipeline.splice(1, 0, { ...match });
  }

  let countPipeline = pipeline.slice(0, price ? 2 : 1);
  countPipeline.push({ $count: "count" });

  try {
    const count = await Product.aggregate(countPipeline);
    console.log(count, countPipeline);
    const searchList = await Product.aggregate(pipeline);
    console.log(searchList);

    let products = [];
    searchList.forEach((product) => {
      let productItem = {
        id: product._id,
        name: product.name[lang]
          ? product.name[lang]
          : product.name[LANG]
          ? product.name[LANG]
          : product.name["en"],
        description: product.description[lang]
          ? product.description[lang]
          : product.description[LANG]
          ? product.description[LANG]
          : product.description["en"],
        tags: product.tags,
        price: product.price,
        productCategory: product.productCategory?._id && {
          id: product.productCategory._id,
          name: product.productCategory.name[lang]
            ? product.productCategory.name[lang]
            : product.productCategory.name[LANG]
            ? product.productCategory.name[LANG]
            : product.productCategory.name["en"],
          additionalPrice: product.productCategory.additionalPrice,
          // additionalCost: product.productCategory.additionalCost,
          stockItem: product.productCategory.stockItem?._id && {
            id: product.productCategory.stockItem._id,
            name: product.productCategory.stockItem.name[lang]
              ? product.productCategory.stockItem.name[lang]
              : product.productCategory.stockItem.name[LANG]
              ? product.productCategory.stockItem.name[LANG]
              : product.productCategory.stockItem.name["en"],
            stockType: product.productCategory.stockItem.stockType?._id && {
              id: product.productCategory.stockItem.stockType._id,
              name: product.productCategory.stockItem.stockType.name[lang]
                ? product.productCategory.stockItem.stockType.name[lang]
                : product.productCategory.stockItem.stockType.name[LANG]
                ? product.productCategory.stockItem.stockType.name[LANG]
                : product.productCategory.stockItem.stockType.name["en"],
            },
            price: product.productCategory.stockItem.price,
            // costToProduce: product.productCategory.stockItem.costToProduce,
          },
        },
      };
      console.log(productItem, "after");
      products.push(productItem);
    });

    let data = {
      page: page.toString(),
      pages: Math.ceil(count[0].count / limit).toString(),
      limit: limit.toString(),
      count: count[0].count.toString(),
      products: products,
    };

    return ErrorHandler(res, 200, lang, data);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { searchProducts };