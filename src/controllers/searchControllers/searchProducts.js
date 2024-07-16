import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import Jwt from "jsonwebtoken";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import User from "../../models/userSchema.js";
import { Product } from "../../models/productSchema.js";
import getNameFromLanguage from "../../utils/getNameFromLanguage.js";

const { LANG, LIMIT, PAGE } = config(process.cwd, ".env").parsed;

const searchProducts = async (req, res) => {
  let { page, limit, lang, text, filter } = req.body;

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

  if (page === undefined || typeof page !== "number") page = PAGE;
  if (limit === undefined || typeof limit !== "number") limit = LIMIT;

  if (!text) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (typeof text !== "string") {
    return ResponseHandler(res, "common", 406, lang);
  }

  if (filter?.price) {
    if (!filter.price.min) filter.price.min = 0;
    if (!filter.price.max) filter.price.max = Number.POSITIVE_INFINITY;
  }

  const regex = /[^(A-Z0-9\s\.\-\@\#\&\*\%\_"\')]+/gi;
  const regex1 = /[A-Z0-9]+/gi;

  const text1 = text.match(regex1)?.join(" ");
  const text2 = text.match(regex);

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
              value: 6,
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
              value: 4,
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
              value: 2,
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
                value: 3,
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
        from: "images",
        localField: "images",
        foreignField: "_id",
        as: "images",
      },
    },
    {
      $addFields: {
        images: {
          $first: "$images",
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
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        tags: 1,
        productCategory: 1,
        images: 1,
        ratings: 1,
        reviews: 1,
        popularity: 1,
        sold: 1,
        productVariants: 1,
        price: 1,
        stockVarietyTypeList: 1,
        score: { $meta: "searchScore" },
      },
    },
  ];

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

    const searchList = await Product.aggregate(pipeline);

    let products = [];
    searchList.forEach((product) => {
      let productItem = {
        _id: product._id,
        score: product.score,
        name: getNameFromLanguage({ type: product.name, lang }),
        description: getNameFromLanguage({ type: product.description, lang }),
        popularity: product.popularity,
        images: product.images?._id && {
          _id: product.images._id,
          name: product.images.name,
          imageUrls: product.images.imageUrls,
          primary: product.images.primary,
        },
        rating: product.ratings,
        reviews: product.reviews,
        sold: product.sold,
        price:
          product?.productCategory?.additionalPrice &&
          product?.productCategory?.stockItem?.price &&
          product.productCategory.additionalPrice +
            product.productCategory.stockItem?.price,
        productCategory: product?.productCategory?._id,
      };

      products.push(productItem);
    });

    //filter section-----------------
    if (filter?.price) {
      products = products.filter(
        (p) => p.price >= filter.price.min && p.price <= filter.price.max
      );
    }

    let data = {
      page: page.toString(),
      pages: Math.ceil(products.length / limit).toString(),
      limit: limit.toString(),
      count: products.length.toString(),
      list: products,
    };

    return ResponseHandler(res, "common", 200, lang, { products: data });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { searchProducts };
