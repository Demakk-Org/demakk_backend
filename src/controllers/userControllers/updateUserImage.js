import { config } from "dotenv";

import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { Image } from "../../models/imageSchema.js";
import User from "../../models/userSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const updateUserImage = async (req, res) => {
  let uid = req?.uid;
  let { lang, image } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!image || !image?.length) {
    return ResponseHandler(res, "common", 400, lang);
  }

  try {
    const user = await User.findById(uid);

    Image.findByIdAndUpdate(user.image, {
      imageUrls: image,
    }).then(async (img) => {
      user.image = img._id;
      await user.save();

      return ResponseHandler(res, "common", 202, lang, img);
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
