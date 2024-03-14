import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { Product } from "../../models/productSchema.js";
import { Review } from "../../models/reviewSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addReview = async (req, res) => {
  let { productId, text, rate, lang } = req.body;

  let uid = req.uid;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!productId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!text && !rate) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(productId)) {
    return ResponseHandler(res, "product", 402, lang);
  }

  if (text && typeof text !== "string") {
    return ResponseHandler(res, "review", 405, lang);
  }

  if (rate && typeof rate !== "number") {
    return ResponseHandler(res, "review", 403, lang);
  }

  if (rate) {
    if (rate <= 0 || rate > 5) {
      return ResponseHandler(res, "review", 407, lang);
    }

    rate = Math.ceil(rate);
  }

  try {
    let review = await Review.findOne({ user: uid, product: productId });
    let newReview = false;
    let previousRate = review?.rating;

    console.log(review);

    if (!review) {
      newReview = true;
      review = await Review.create({
        user: uid,
        product: productId,
      });
    }

    if (text) review.text = text;
    if (rate) review.rating = rate;

    review.save().then(async () => {
      const product = await Product.findById(productId);

      if (!product) {
        return ResponseHandler(res, "product", 404, lang);
      }

      if (rate) {
        if (review.rating) {
          product.ratings[rate] += 1;
          product.ratings.average =
            (product.ratings.average * product.ratings.count + rate) /
            (product.ratings.count + 1);
          product.ratings.count += 1;
        } else {
          product.ratings[previousRate] -= 1;
          product.ratings[rate] += 1;
          product.ratings.average =
            product.ratings.average +
            (rate - previousRate) / product.ratings.count;
        }
      }

      if (!product.reviews.includes(review._id)) {
        product.reviews.push(review._id);
      }

      await product.save();

      return ResponseHandler(
        res,
        "common",
        newReview ? 201 : 202,
        lang,
        review
      );
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
