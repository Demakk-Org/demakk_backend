import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import response from "../../../response.js";
import User from "../../models/userSchema.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { Product } from "../../models/productSchema.js";

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
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(productId)) {
    return ResponseHandler(res, "product", 402, lang);
  }

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return ResponseHandler(res, "product", 404, lang);
    }

    const user = await User.findById(uid);

    if (user.favs.includes(productId)) {
      user.favs = user.favs.filter((f) => f != productId);
      user.save();

      return ResponseHandler(res, "product", 201, lang);
    } else {
      user.favs.push(productId);
      user.save();

      return ResponseHandler(res, "product", 200, lang);
    }
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
