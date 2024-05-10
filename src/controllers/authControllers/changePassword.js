import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import bcrypt from "bcryptjs";

import User from "../../models/userSchema.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const changePassword = async (req, res) => {
  let { password, confirmPassword, lang } = req.body;
  let uid = req.uid;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!isValidObjectId(uid)) {
    return ResponseHandler(res, "user", 402, lang);
  }

  if (!password || !confirmPassword) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (password != confirmPassword) {
    return ResponseHandler(res, "auth", 404, lang);
  }

  try {
    const user = await User.findById(uid).select("password");

    if (!user) {
      return ResponseHandler(res, "user", 404, lang);
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return ResponseHandler(res, "common", 202, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default changePassword;
