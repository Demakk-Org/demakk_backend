import { config } from "dotenv";

import { uploadImage } from "../../utils/uploadImages.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import { Image } from "../../models/imageSchema.js";
import User from "../../models/userSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addUserImage = async (req, res) => {
  let image = req.files?.image;
  let uid = req?.uid;
  let { lang } = req.fields;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!image) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (typeof image !== "object" || !image.name) {
    return ResponseHandler(res, "image", 408, lang);
  }

  try {
    const user = await User.findById(uid);

    uploadImage([image]).then(async (data) => {
      Image.create({
        rid: uid,
        type: "User",
        images: data,
      }).then(async (img) => {
        user.image = img._id;
        await user.save();

        return ResponseHandler(res, "common", 202, lang, img);
      });
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
