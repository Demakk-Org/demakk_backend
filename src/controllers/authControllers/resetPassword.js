import ResetPassword from "../../models/resetPassword.js";
import User from "../../models/userSchema.js";
import bcrypt from "bcryptjs";
import response from "../../../response.js";
import dotenv from "dotenv";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const resetPassword = async (req, res) => {
  let { id, password, confirmPassword, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (!id || !password || !confirmPassword) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(id)) {
    return ErrorHandler(res, 407, lang);
  }

  if (password !== confirmPassword) {
    return ErrorHandler(res, 402, lang);
  }
  console.log(id);
  const reset = await ResetPassword.findById(id);
  console.log(reset);

  if (!reset) {
    return ErrorHandler(res, 404, lang);
  }

  if (reset.status == "complete") {
    return ErrorHandler(res, 406, lang);
  }

  const now = new Date(Date.now() - reset.expiresIn);
  const time = reset.requestedAt;

  console.log(now, time);

  if (now > time) {
    return ErrorHandler(res, 406, lang);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    User.findByIdAndUpdate(
      reset.uid,
      {
        password: hashedPassword,
      },
      {
        returnDocument: "after",
      }
    )
      .then((user) => {
        console.log(user);
        return ErrorHandler(res, 203, lang);
      })
      .finally(() => {
        reset.status = "complete";
        reset.save();
      });
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export default resetPassword;
