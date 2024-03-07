import { config } from "dotenv";
import response from "../../../response.js";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { Image } from "../../models/imageSchema.js";
import { uploadImage } from "../../utils/uploadImages.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const updateImages = async (req, res) => {
  let { image } = req.files;

  let { lang, images, primary, imagesId, name, description } = req.fields;

  let imageList = [];
  let imagesParsed = [];

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!imagesId && !images) {
    return ErrorHandler(res, 400, lang);
  }

  if (!image && !name && !description && !primary) {
    return ErrorHandler(res, 400, lang);
  }

  if (images) imagesParsed = JSON.parse(images);
  if (primary) primary = primary * 1;

  if (images && images?.length == 0) {
    return ErrorHandler(res, 400, lang);
  }

  if (name && typeof name !== "string") {
    return ErrorHandler(res, 487, lang);
  }

  if (description && typeof description !== "string") {
    return ErrorHandler(res, 488, lang);
  }

  if (image && image?.length) {
    imageList = [...image];
  } else if (image) {
    imageList = [image];
  }

  if (!isValidObjectId(imagesId)) {
    return ErrorHandler(res, 491, lang);
  }

  try {
    let productImages = await Image.findById(imagesId);

    if (!productImages) {
      return ErrorHandler(res, 492, lang);
    }

    if (imageList?.length > 0) {
      const results = await uploadImage(imageList);
      console.log(results);

      productImages.images = [...imagesParsed, ...results];

      if (primary < 0 || primary >= [...imagesParsed, ...results].length) {
        return ErrorHandler(res, 490, lang);
      }

      if (image) if (primary || primary == 0) productImages.primary = primary;

      if (name) productImages.name = name;
      if (description) productImages.description = description;

      await productImages.save();

      return ErrorHandler(res, 200, lang, productImages);
    } else {
      if (imagesParsed.length) productImages.images = imagesParsed;

      if (images && (primary < 0 || primary >= imagesParsed?.length)) {
        return ErrorHandler(res, 490, lang);
      }

      if ((primary || primary == 0) && primary > productImages.images.length) {
        return ErrorHandler(res, 490, lang);
      }

      if ((primary || primary == 0) && primary <= productImages.images.length) {
        productImages.primary = primary;
      }
      if (name) productImages.name = name;
      if (description) productImages.description = description;

      await productImages.save();

      return ErrorHandler(res, 200, lang, productImages);
    }
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
