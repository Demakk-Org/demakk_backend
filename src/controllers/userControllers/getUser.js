import User from "../../models/userSchema.js";
import Jwt from "jsonwebtoken";
import language from "../../../language.js";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { config } from "dotenv";

const LANG = config(process.cwd, ".env").parsed.LANG;

async function getUser(req, res) {
  let { lang } = req.body;
  const token = req.headers.authorization.split(" ")[1];

  const { uid } = Jwt.decode(token, "your_secret_key");

  console.log(Jwt.decode(token, "your_secret_key"));

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!isValidObjectId(uid)) {
    return ErrorHandler(res, 418, lang);
  }

  try {
    const user = await User.findById(uid)
      .select(
        "email phoneNumber firstName lastName role shippingAddress billingAddress cart"
      )
      .populate("role shippingAddress billingAddress cart");
    console.log(user);
    return ErrorHandler(res, 200, lang, user);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
}

export default getUser;
