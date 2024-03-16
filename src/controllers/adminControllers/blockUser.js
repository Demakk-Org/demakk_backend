import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import User from "../../models/userSchema.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const blockUser = (req, res) => {
  let { uid, block, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!uid || block == null) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(uid)) {
    return ResponseHandler(res, "user", 402, lang);
  }

  try {
    User.findById(uid)
      .select("blocked")
      .then(async (user) => {
        if (!user) {
          return ResponseHandler(res, "user", 404, lang);
        }

        if (block && user.blocked) {
          return ResponseHandler(res, "user", 405, lang);
        }

        if (!block && !user.blocked) {
          return ResponseHandler(res, "user", 406, lang);
        }

        user.blocked = block;
        await user.save();
        return block
          ? ResponseHandler(res, "user", 201, lang)
          : ResponseHandler(res, "user", 202, lang);
      });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { blockUser };
