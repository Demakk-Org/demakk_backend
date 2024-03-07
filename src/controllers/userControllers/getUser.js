import User from "../../models/userSchema.js";
import Jwt from "jsonwebtoken";
import response from "../../../response.js";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { config } from "dotenv";

const LANG = config(process.cwd, ".env").parsed.LANG;

async function getUser(req, res) {
  let { lang } = req.body;

  const token = req.headers.authorization.split(" ")[1];
  const { uid } = Jwt.decode(token, "your_secret_key");

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req?.language;
  }

  if (!isValidObjectId(uid)) {
    return ErrorHandler(res, 418, lang);
  }

  try {
    const user = await User.findById(uid)
      .select("-password -_id")
      .populate("role shippingAddress billingAddress cart");
    console.log(user);
    return ErrorHandler(res, 200, lang, user);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
}

export default getUser;
