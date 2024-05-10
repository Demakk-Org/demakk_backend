import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import Jwt from "jsonwebtoken";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import User from "../../models/userSchema.js";
import { Product } from "../../models/productSchema.js";

const { LANG, LIMIT, PAGE, SORT } = config(process.cwd, ".env").parsed;

const searchProducts = async (req, res) => {
  let { page, limit, lang, sort, text, price } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  let uid;

  const token = req.headers?.authorization?.split(" ")[1];

  if (token && Jwt.verify(token, "your_secret_key")) {
    uid = Jwt.decode(token, "your_secret_key")?.uid;
  }

  if (uid && !isValidObjectId(uid)) {
    uid = "";
  }

  if (sort === undefined) sort = SORT;
  if (page === undefined || typeof page !== "number") page = PAGE;
  if (limit === undefined || typeof limit !== "number") limit = LIMIT;

  if (!text) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (typeof text !== "string") {
    return ResponseHandler(res, "common", 406, lang);
  }

  if (
    price &&
    (!(price instanceof Object && price.constructor === Object) ||
      !price.gte ||
      !price.lt)
  ) {
    return ResponseHandler(res, "product", 407, lang);
  }

  let match = {};

  const regex = /[^(A-Z0-9\s\.)]+/gi;
  const regex1 = /[A-Z0-9]+/gi;

  const text1 = text.match(regex1)?.join(" ");
  const text2 = text.match(regex);

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

  let shouldList = [];

  if (text1) {
    shouldList.push(
      {
        text: {
          query: text1,
          path: "name.en",
          fuzzy: {
            prefixLength: 0,
          },
          score: {
            boost: {
              value: 3,
            },
          },
        },
      },
      {
        text: {
          query: text1,
          path: "description.en",
          fuzzy: {
            prefixLength: 2,
          },
          score: {
            boost: {
              value: 1,
            },
          },
        },
      },
      {
        text: {
          query: text1,
          path: "tags",
          fuzzy: {
            prefixLength: 2,
          },
          score: {
            boost: {
              value: 5,
            },
          },
        },
      }
    );
  }

  if (text2) {
    text2.forEach((amh) => {
      shouldList.push(
        {
          text: {
            query: amh,
            path: "name.am",
            fuzzy: {
              prefixLength: 0,
            },
            score: {
              boost: {
                value: 5,
              },
            },
          },
        },
        {
          text: {
            query: amh,
            path: "name.en",
            synonyms: "mySynonyms",
            score: {
              boost: {
                value: 3,
              },
            },
          },
        }
      );
    });
  }

  let pipeline = [
    {
      $search: {
        index: "synonym",
        compound: {
          should: shouldList,
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
    try {
      if (uid) {
        const user = await User.findById(uid).select("searchTerms");

        let exists = user.searchTerms.includes(text);

        if (!exists) {
          user.searchTerms.push(text);
          await user.save();
        }
      }
    } catch (error) {
      console.log(error.message);
    }

    let count = await Product.aggregate(countPipeline);

    const searchList = await Product.aggregate(pipeline);

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
        score: product.score,
      };

      products.push(productItem);
    });

    count = count[0]?.count ? count[0]?.count : 0;

    let data = {
      page: page.toString(),
      pages: Math.ceil(count / limit).toString(),
      limit: limit.toString(),
      count: count.toString(),
      products: products,
    };

    return ResponseHandler(res, "common", 200, lang, data);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { searchProducts };
