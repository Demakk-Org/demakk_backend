import { config } from "dotenv";
import response from "../../../response.js";
import { Review } from "../../models/reviewSchema.js";
import { Product } from "../../models/productSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addReview = async (req, res) => {
  let { productId, type, text, rate, lang } = req.body;

  let uid = req.uid;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!type || !(type == "text" || type == "rate")) {
    return ErrorHandler(res, 478, lang);
  }

  if (typeof type !== "string") {
    return ErrorHandler(res, 479, lang);
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

    console.log(review);

    if (
      (type == "text" && review?.text) ||
      (type == "rate" && review?.rating)
    ) {
      return ErrorHandler(res, 476, lang);
    }

    if (!review) {
      review = await Review.create({
        user: uid,
        product: productId,
      });
    }

    if (type == "text") review.text = text;
    if (type == "rate") review.rating = rate;

    review.save().then(async () => {
      const product = await Product.findById(productId);

      if (!product) {
        return ErrorHandler(res, 433, lang);
      }

      if (rate) {
        product.ratings.average =
          (product.ratings.average * product.ratings.count + rate) /
          (product.ratings.count + 1);
        product.ratings.count += 1;
      }

      if (!product.reviews.includes(review._id)) {
        product.reviews.push(review._id);
      }
      await product.save();

      return ErrorHandler(res, 200, lang, review);
    });
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
