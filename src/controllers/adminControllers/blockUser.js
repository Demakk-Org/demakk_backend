import { config } from "dotenv";
import language from "../../../language.js";
import User from "../../models/userSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const blockUser = (req, res) => {
  let { uid, block, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!uid || block == null) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(uid)) {
    return ErrorHandler(res, 418, lang);
  }

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

      try {
        user.blocked = block;
        await user.save();
        return block
          ? ErrorHandler(res, 419, lang)
          : ErrorHandler(res, 420, lang);
      } catch (err) {
        console.log(err);
        return ErrorHandler(res, 500, lang);
      }
    });
};

export default blockUser;
