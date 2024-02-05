import { decode } from "jsonwebtoken";
import language from "../../language.js";
import { config } from "dotenv";
import { ErrorHandler } from "../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const UserAuthentication = (req, res, next) => {
  let { lang } = req.body;
  const token = req.headers?.authorization?.split(" ")[1];
  const bearer = req.headers?.authorization?.split(" ")[0];

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!token || bearer !== "Bearer") {
    console.error("Authentication failed: No token provided");
    return ErrorHandler(res, 449, lang);
  }

  const tokenValues = decode(token, "your_secret_key");
  console.log(tokenValues);

  if (!tokenValues) {
    console.error("Authentication failed: Invalid token");
    return ErrorHandler(res, 450, lang);
  }

  let { exp, uid } = tokenValues; //removed lang: include in later version

  if (!uid) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(uid)) {
    return ErrorHandler(res, 418, lang);
  }

  if (Date.now() > exp) {
    console.error("Authentication failed: Token has expired");
    return ErrorHandler(res, 451, lang);
  }

  next();
};

export default UserAuthentication;
