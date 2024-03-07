import { config } from "dotenv";
import response from "../../../response.js";
import { Product } from "../../models/productSchema.js";
import User from "../../models/userSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addFavourite = async (req, res) => {
  let { productId, lang } = req.body;
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

  if (!isValidObjectId(productId)) {
    return ErrorHandler(res, 432, lang);
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return ErrorHandler(res, 433, lang);
    }

    const user = await User.findById(uid);

    if (user.favs.includes(productId)) {
      user.favs = user.favs.filter((f) => f != productId);
      user.save();
      return ErrorHandler(res, 215, lang);
    } else {
      user.favs.push(productId);
      user.save();
      return ErrorHandler(res, 214, lang);
    }
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
