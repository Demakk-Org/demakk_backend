import User from "../../models/userSchema.js";
import Jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

async function getUser(req, res) {
  let { lang } = req.body;

  const token = req.headers.authorization.split(" ")[1];
  const { uid } = Jwt.decode(token, "your_secret_key");

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req?.language;
  }

  if (!isValidObjectId(uid)) {
    return ResponseHandler(res, "user", 402, lang);
  }

  try {
    const user = await User.findById(uid)
      .select("-password -_id")
      .populate("role shippingAddress billingAddress cart");

    if (!user) {
      return ResponseHandler(res, "user", 404, lang);
    }

    console.log(user);
    return ResponseHandler(res, "common", 200, lang, user);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
}

export default getUser;
