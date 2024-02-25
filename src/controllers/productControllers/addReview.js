import { config } from "dotenv";
import response from "../../../response.js";
import { Review } from "../../models/reviewSchema.js";
import { Product } from "../../models/productSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addReview = async (req, res) => {
  let { productId, text, rate, lang } = req.body;

  let uid = req.uid;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!productId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!text && !rate) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(productId)) {
    return ErrorHandler(res, 432, lang);
  }

  if (text && typeof text !== "string") {
    return ErrorHandler(res, 474, lang);
  }

  if (rate && typeof rate !== "number") {
    return ErrorHandler(res, 475, lang);
  }

  if (rate) {
    if (rate <= 0 || rate > 5) {
      return ErrorHandler(res, 477, lang);
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
        return ErrorHandler(res, 433, lang);
      }
      if (rate) {
        if (newReview) {
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

      return ErrorHandler(res, newReview ? 201 : 203, lang, review);
    });
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
