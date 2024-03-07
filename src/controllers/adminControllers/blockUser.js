import { config } from "dotenv";
import response from "../../../response.js";
import User from "../../models/userSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const blockUser = (req, res) => {
  let { uid, block, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!uid || block == null) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(uid)) {
    return ErrorHandler(res, 418, lang);
  }

  try {
    User.findById(uid)
      .select("blocked")
      .then(async (user) => {
        if (!user) {
          return ErrorHandler(res, 416, lang);
        }

        if (block && user.blocked) {
          return ErrorHandler(res, 421, lang);
        }

        if (!block && !user.blocked) {
          return ErrorHandler(res, 422, lang);
        }

        user.blocked = block;
        await user.save();
        return block
          ? ErrorHandler(res, 419, lang)
          : ErrorHandler(res, 420, lang);
      });
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { blockUser };
