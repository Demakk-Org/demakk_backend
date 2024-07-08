import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { Product } from "../../models/productSchema.js";
import Jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import User from "../../models/userSchema.js";
import getNameFromLanguage from "../../utils/getNameFromLanguage.js";
import fromMapToObject from "../../utils/fromMapToObject.js";

const { LANG } = config(process.cwd, ".env").parsed;

let productCategoriesRank = {
  view: 2,
  fav: 5,
  search: 7,
};

const relatedProducts = async (req, res) => {
  let { lang, productCategoryIds, stockItemIds } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }
  if (!productCategoryIds) productCategoryIds = [];

  let uid;

  const token = req.headers?.authorization?.split(" ")[1];

  if (token && Jwt.verify(token, "your_secret_key")) {
    uid = Jwt.decode(token, "your_secret_key")?.uid;
  }

  if (uid && !isValidObjectId(uid)) {
    uid = "";
  }

  try {
    let combinedProductCategoryIds = [];

    let userFavProductCategoryIds = [];
    let userViewProductCategoryIds = [];

    if (uid) {
      let userProductCategories = await User.findById(uid)
        .select("favs views")
        .populate({ path: "favs", select: "productCategory" })
        .populate({
          path: "views",
          populate: { path: "pid", select: "productCategory" },
        });

      userFavProductCategoryIds = userProductCategories.favs.map((fav) =>
        fav.productCategory.toString()
      );

      userViewProductCategoryIds = userProductCategories.views.map((view) =>
        view.pid.productCategory.toString()
      );
    }

    combinedProductCategoryIds = [
      ...productCategoryIds,
      ...userFavProductCategoryIds,
      ...userViewProductCategoryIds,
    ];

    const frequencyMap = {};

    combinedProductCategoryIds.forEach((item) => {
      if (frequencyMap[item]) {
        frequencyMap[item] += 1;
      } else {
        frequencyMap[item] = 1;
      }
    });

    const frequencyArray = Object.keys(frequencyMap).map((key) => ({
      value: key,
      count: frequencyMap[key],
    }));

    Product.find({
      productCategory: combinedProductCategoryIds,
    })
      .populate({ path: "images" })
      .populate({
        path: "productCategory",
        populate: { path: "stockItem", populate: { path: "stockType" } },
      })
      .then((response) => {
        let productsRanks = response.map((p) => {
          let score = 1;
          if (!p.productCategory?._id) return;

          let categoryFromFrequencyArray = frequencyArray.find(
            (a) => a.value == p.productCategory._id
          );

          if (
            userFavProductCategoryIds.includes(p.productCategory._id.toString())
          ) {
            score +=
              productCategoriesRank.fav * categoryFromFrequencyArray.count;
          }

          if (
            userViewProductCategoryIds.includes(
              p.productCategory._id.toString()
            )
          ) {
            score +=
              productCategoriesRank.view * categoryFromFrequencyArray.count;
          }

          if (productCategoryIds.includes(p.productCategory._id.toString())) {
            score +=
              productCategoriesRank.search * categoryFromFrequencyArray.count;
          }

          return { ...p._doc, score };
        });

        let orderedProduct = productsRanks.sort((a, b) => b.score - a.score);

        let returnedOrderedProduct = [];

        orderedProduct.forEach((product) => {
          if (!product) return;

          let productItem = {
            _id: product._id,
            score: product.score,
            name: getNameFromLanguage({
              type: fromMapToObject(product.name),
              lang,
            }),
            description: getNameFromLanguage({
              type: fromMapToObject(product.description),
              lang,
            }),
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

          returnedOrderedProduct.push(productItem);
        });

        let maxScore = Math.max(...returnedOrderedProduct.map((p) => p.score));
        let maxPopularity = Math.max(
          ...returnedOrderedProduct.map((p) => p.popularity)
        );
        let maxRating = Math.max(
          ...returnedOrderedProduct.map((p) => p.rating.average)
        );

        returnedOrderedProduct.forEach((p) => {
          p.score =
            (p.score / maxScore) * 100 +
            (p.popularity / maxPopularity) * 100 +
            (p.rating.average / maxRating) * 100;
        });

        returnedOrderedProduct.sort((a, b) => b.score - a.score);

        return ResponseHandler(
          res,
          "common",
          200,
          lang,
          returnedOrderedProduct
        );
      })
      .catch((err) => {
        console.log(err);
        return ResponseHandler(res, "common", 500, lang);
      });
  } catch (error) {
    console.log(error);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default relatedProducts;
