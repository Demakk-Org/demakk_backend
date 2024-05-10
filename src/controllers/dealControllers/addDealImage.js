import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import { uploadImage } from "../../utils/uploadImages.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { Image } from "../../models/imageSchema.js";
import Deal from "../../models/dealSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addDealImages = async (req, res) => {
  const { image } = req.files;
  let { lang, rid, name, description, primary, type } = req.fields;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!rid && !name) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(rid)) {
    return ResponseHandler(res, "deal", 402, lang);
  }

  if (typeof name !== "string") {
    return ResponseHandler(res, "image", 401, lang);
  }

  if (typeof type !== "string") {
    return ResponseHandler(res, "images", 409, lang);
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
    let deal = await Deal.findById(rid).select("images");

    if (!deal) {
      return ResponseHandler(res, "deal", 404, lang);
    }

    uploadImage(images).then((data) => {
      Image.create({
        rid,
        name,
        type,
        description,
        primary: primary ? primary : 0,
        images: data,
      }).then(async (resp) => {
        deal.images = resp._id;
        await deal.save();

        return ResponseHandler(res, "common", 201, lang, resp);
      });
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default addDealImages;
