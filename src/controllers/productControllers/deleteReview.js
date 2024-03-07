import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import { Review } from "../../models/reviewSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const deleteReview = async(req, res) => {
  let { reviewId, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!reviewId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(reviewId)) {
    return ErrorHandler(res, 493, lang);
  }

  try {
    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return ErrorHandler(res, 494, lang);
    }

    return ErrorHandler(res, 204, lang);
    
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
