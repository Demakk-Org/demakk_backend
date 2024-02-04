import { decode } from "jsonwebtoken";
import language from "../../language.js";
import dotenv from "dotenv";
import { ObjectId } from "bson";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const UserAuthentication = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  const bearer = req.headers?.authorization?.split(" ")[0];

  if (!token || bearer !== "Bearer") {
    console.error("Authentication failed: No token provided");
    return res.status(401).json({ message: language[LANG].response[401] });
  }

  const tokenValues = decode(token, "your_secret_key");
  console.log(tokenValues);

  if (!tokenValues) {
    console.error("Authentication failed: Invalid token");
    return res.status(401).json({ message: language[LANG].response[401] });
  }

  let { exp, lang, uid } = tokenValues;

  if (!uid || !ObjectId.isValid(uid)) {
    return res.status(401).json({ message: language[LANG].response[407] });
  }

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (Date.now() > exp) {
    console.error("Authentication failed: Token has expired");
    return res.status(401).json({ message: language[LANG].response[401] });
  }

  next();
};

export default UserAuthentication; //Bearer token
