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
    const user = await User.findById(uid).populate("image");

    let promises = [];

    if (!user.image) {
      return Image.create({ imageUrls: image, rid: uid, type: "user" }).then(
        async (res) => {
          user.image = res._id;
          promises.push(user.save());
        }
      );
    } else {
      promises.push(
        Image.findByIdAndUpdate(user.image, {
          imageUrls: image,
        })
      );
    }

    return Promise.all(promises)
      .then(() => {
        return ResponseHandler(res, "common", 200, lang);
      })
      .catch((err) => {
        console.log(err);
        return ResponseHandler(res, "common", 500, lang);
      });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
