import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { uploadImage } from "../../utils/uploadImages.js";
import { isValidObjectId } from "mongoose";
import { Image } from "../../models/imageSchema.js";
import { Product } from "../../models/productSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addImages = async (req, res) => {
  const { image } = req.files;
  let { lang, productId, name, description, primary } = req.fields;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!productId && !name) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(productId)) {
    return ErrorHandler(res, 432, lang);
  }

  if (typeof name !== "string") {
    return ErrorHandler(res, 487, lang);
  }

  if (description && typeof description !== "string") {
    return ErrorHandler(res, 488, lang);
  }

  if (
    primary &&
    typeof primary !== "string" &&
    typeof (primary * 1) !== "number"
  ) {
    return ErrorHandler(res, 489, lang);
  }

  if (!image) {
    return ErrorHandler(res, 400, lang);
  }

  const results = [];

  let images = [];

  if (image.length) {
    images = [...image];
  } else {
    images = [image];
  }

  if (primary < 0 || primary >= images.length) {
    return ErrorHandler(res, 490, lang);
  }

  try {
    let product = await Product.findById(productId).select("images");

    if (!product) {
      return ErrorHandler(res, 433, lang);
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

        return ErrorHandler(res, 201, lang, resp);
      });
    });
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
