import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import { Image } from "../../models/imageSchema.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const { LANG } = config(process.cwd, ".env").parsed;

export const addOrUpdateProductImages = async (req, res) => {
  let { lang, rid, name, description, primary, imageUrls, type } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!rid && !type) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(rid)) {
    return ResponseHandler(res, "product", 402, lang);
  }

  if (name && typeof name !== "string") {
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

  if (imageUrls && (!Array.isArray(imageUrls) || imageUrls.length === 0)) {
    return ResponseHandler(res, "image", 400, lang);
  }

  if (primary < 0 || primary >= imageUrls.length) {
    return ResponseHandler(res, "image", 407, lang);
  }

  try {
    let image = await Image.findOne({ rid });

    if (!image) {
      Image.create({
        rid,
        name,
        description,
        primary: primary ? primary : 0,
        imageUrls,
        type,
      }).then(async (resp) => {
        console.log(resp);

        return ResponseHandler(res, "common", 201, lang, { image: resp });
      });
    } else {
      if (name) image.name = name;
      if (description) image.description = description;
      if (primary) image.primary = primary ? primary : 0;
      if (imageUrls) image.imageUrls = imageUrls;
      if (type) image.type = type;
      await image.save();

      return ResponseHandler(res, "common", 202, lang);
    }
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
