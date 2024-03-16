import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import { uploadImage } from "../../utils/uploadImages.js";
import { Image } from "../../models/imageSchema.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { Product } from "../../models/productSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addImages = async (req, res) => {
  const { image } = req.files;
  let { lang, productId, name, description, primary } = req.fields;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!productId && !name) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(productId)) {
    return ResponseHandler(res, "product", 402, lang);
  }

  if (typeof name !== "string") {
    return ResponseHandler(res, "image", 401, lang);
  }

  if (description && typeof description !== "string") {
    return ResponseHandler(res, "image", 403, lang);
  }

  if (
    primary &&
    typeof primary !== "string" &&
    typeof (primary * 1) !== "number"
  ) {
    return ResponseHandler(res, "image", 406, lang);
  }

  if (!image) {
    return ResponseHandler(res, "image", 400, lang);
  }

  const results = [];

  let images = [];

  if (image.length) {
    images = [...image];
  } else {
    images = [image];
  }

  if (primary < 0 || primary >= images.length) {
    return ResponseHandler(res, "image", 407, lang);
  }

  try {
    let product = await Product.findById(productId).select("images");

    if (!product) {
      return ResponseHandler(res, "product", 404, lang);
    }

    uploadImage(images).then((data) => {
      Image.create({
        product: productId,
        name,
        description,
        primary: primary ? primary : 0,
        images: data,
      }).then(async (resp) => {
        product.images = resp._id;
        await product.save();

        return ResponseHandler(res, "common", 201, lang, resp);
      });
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
