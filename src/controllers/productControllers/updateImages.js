import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import { uploadImage } from "../../utils/uploadImages.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { Image } from "../../models/imageSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const updateImages = async (req, res) => {
  let { image } = req.files;

  let { lang, images, primary, imagesId, name, description } = req.fields;

  let imageList = [];
  let imagesParsed = [];

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!imagesId && !images) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!image && !name && !description && !primary) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (images) imagesParsed = JSON.parse(images);
  if (primary) primary = primary * 1;

  if (images && images?.length == 0) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (name && typeof name !== "string") {
    return ResponseHandler(res, "image", 401, lang);
  }

  if (description && typeof description !== "string") {
    return ResponseHandler(res, "image", 403, lang);
  }

  if (image && image?.length) {
    imageList = [...image];
  } else if (image) {
    imageList = [image];
  }

  if (!isValidObjectId(imagesId)) {
    return ResponseHandler(res, "image", 402, lang);
  }

  try {
    let productImages = await Image.findById(imagesId);

    if (!productImages) {
      return ResponseHandler(res, "image", 404, lang);
    }

    if (imageList?.length > 0) {
      const results = await uploadImage(imageList);
      console.log(results);

      productImages.images = [...imagesParsed, ...results];

      if (primary < 0 || primary >= [...imagesParsed, ...results].length) {
        return ResponseHandler(res, "image", 407, lang);
      }

      if (image) if (primary || primary == 0) productImages.primary = primary;

      if (name) productImages.name = name;
      if (description) productImages.description = description;

      await productImages.save();

      return ResponseHandler(res, "common", 200, lang, productImages);
    } else {
      if (imagesParsed.length) productImages.images = imagesParsed;

      if (images && (primary < 0 || primary >= imagesParsed?.length)) {
        return ResponseHandler(res, "image", 407, lang);
      }

      if ((primary || primary == 0) && primary > productImages.images.length) {
        return ResponseHandler(res, "image", 407, lang);
      }

      if ((primary || primary == 0) && primary <= productImages.images.length) {
        productImages.primary = primary;
      }
      if (name) productImages.name = name;
      if (description) productImages.description = description;

      await productImages.save();

      return ResponseHandler(res, "common", 200, lang, productImages);
    }
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
