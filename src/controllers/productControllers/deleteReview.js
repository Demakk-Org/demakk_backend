import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import { Review } from "../../models/reviewSchema.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const deleteReview = async (req, res) => {
  let { reviewId, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!reviewId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(reviewId)) {
    //return ErrorHandler(res, 493, lang);
    return ResponseHandler(res, "review", 402, lang);
  }

  try {
    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      //return ErrorHandler(res, 494, lang);
      return ResponseHandler(res, "review", 409, lang);
    }

    return ResponseHandler(res, "common", 203, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
