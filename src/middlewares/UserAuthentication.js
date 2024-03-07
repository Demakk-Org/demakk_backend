import { decode } from "jsonwebtoken";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import User from "../models/userSchema.js";
import responsse from "../../responsse.js";
import { ResponseHandler } from "../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const UserAuthentication = (req, res, next) => {
  let { lang } = req.body;

  const token = req.headers?.authorization?.split(" ")[1];
  const bearer = req.headers?.authorization?.split(" ")[0];

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (!token || bearer !== "Bearer") {
    return ResponseHandler(res, "auth", 411, lang);
  }

  const tokenValues = decode(token, "your_secret_key");
  console.log(tokenValues, "values");

  if (!tokenValues) {
    console.error("Authentication failed: Invalid token");
    return ResponseHandler(res, "auth", 412, lang);
  }

  let { exp, uid } = tokenValues;

  if (!uid) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(uid)) {
    return ResponseHandler(res, "user", 402, lang);
  }

  if (Date.now() > exp) {
    console.error("Authentication failed: Token has expired");
    return ResponseHandler(res, "auth", 413, lang);
  }

  try {
    User.findById(uid)
      .select("-password")
      .populate("role")
      .then((user) => {
        req.language = user.lang;
        req.user = user;
        req.uid = uid;
        req.role = user.role.name;
        next();
      });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default UserAuthentication;
