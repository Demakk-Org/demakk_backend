import bcrypt from "bcryptjs";
import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import ResetPassword from "../../models/resetPassword.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import User from "../../models/userSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const resetPassword = async (req, res) => {
  let { id, password, confirmPassword, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (!id || !password || !confirmPassword) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(id)) {
    return ResponseHandler(res, "common", 406, lang);
  }

  if (password !== confirmPassword) {
    return ResponseHandler(res, "auth", 404, lang);
  }

  const reset = await ResetPassword.findById(id);
  console.log(reset);

  if (!reset) {
    return ResponseHandler(res, "common", 404, lang);
  }

  if (reset.status == "complete") {
    return ResponseHandler(res, "auth", 401, lang);
  }

  const now = new Date(Date.now() - reset.expiresIn);
  const time = reset.requestedAt;

  console.log(now, time);

  if (now > time) {
    return ResponseHandler(res, "auth", 401, lang);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    let user = await User.findById(reset.uid);

    if (!user) {
      return ResponseHandler(res, "user", 404, lang);
    }

    user.password = hashedPassword;
    await user.save().then(() => {
      reset.status = "complete";
      reset.save();

      return ResponseHandler(res, "common", 202, lang);
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default resetPassword;
