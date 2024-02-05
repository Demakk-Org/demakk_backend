import Jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { config } from "dotenv";
import language from "../../language.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const AdminAuthentication = (req, res, next) => {
  let lang = req.body.lang;
  const token = req.headers?.authorization?.split(" ")[1];

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!token) {
    return ErrorHandler(res, 449, lang);
  }
  const tokenValues = Jwt.decode(token, "your_secret_key");

  if (!tokenValues) {
    return ErrorHandler(res, 450, lang);
  }

  const { exp, uid } = tokenValues;

  if (Date.now() > exp) {
    return ErrorHandler(res, 451, lang);
  }

  User.findById(uid, "role")
    .populate("role")
    .then((user) => {
      console.log(uid, user);
      if (user.role.name === "admin") {
        return next();
      } else {
        return ErrorHandler(res, 452, lang);
      }
    });
};

export default AdminAuthentication;
