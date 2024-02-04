import User from "../../models/userSchema.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import language from "../../../language.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const changePassword = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];

  const { uid } = Jwt.decode(token, "your_secret_key");

  let { password, confirmPassword, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!isValidObjectId(uid)) {
    return ErrorHandler(res, 407, lang);
  }

  if (!password || !confirmPassword) {
    return ErrorHandler(res, 400, lang);
  }

  if (password != confirmPassword) {
    return ErrorHandler(res, 402, lang);
  }

  try {
    const user = await User.findById(uid).select("password");

    if (!user) {
      return ErrorHandler(res, 404, lang);
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return ErrorHandler(res, 203, lang);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export default changePassword;
