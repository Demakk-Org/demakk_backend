import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { Image } from "../../models/imageSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const updateImages = async (req, res) => {
  let { lang, imageUrls, primary, imagesId, name, description } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!imagesId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(imagesId)) {
    return ResponseHandler(res, "image", 402, lang);
  }

  if (!name && !description && !primary && !imageUrls) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (primary) primary = primary * 1;

  if (imageUrls && imageUrls?.length == 0) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (name && typeof name !== "string") {
    return ResponseHandler(res, "image", 401, lang);
  }

  if (description && typeof description !== "string") {
    return ResponseHandler(res, "image", 403, lang);
  }

  try {
    let productImages = await Image.findById(imagesId);
    console.log(productImages);

    if (!productImages) {
      return ResponseHandler(res, "image", 404, lang);
    }

    if (primary < 0 || primary >= imageUrls.length) {
      return ResponseHandler(res, "image", 407, lang);
    }

    if (primary || primary == 0) productImages.primary = primary;
    if (name) productImages.name = name;
    if (description) productImages.description = description;
    if (imageUrls) productImages.imageUrls = imageUrls;

    await productImages.save();

    return ResponseHandler(res, "common", 200, lang, productImages);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
