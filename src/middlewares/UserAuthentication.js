import Jwt from "jsonwebtoken";
import language from "../../language.js";
import dotenv from "dotenv";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const UserAuthentication = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) {
    console.error("Authentication failed: No token provided");
    return res.status(401).json({ message: language[LANG].response[401] });
  }
  const tokenValues = Jwt.decode(token, "your_secret_key");

  if (!tokenValues) {
    console.error("Authentication failed: Invalid token");
    return res.status(401).json({ message: language[LANG].response[401] });
  }

  let { exp, lang } = tokenValues;
  console.log(lang);

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
