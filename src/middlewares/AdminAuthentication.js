import Jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { config } from "dotenv";
import response from "../../response.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const AdminAuthentication = (req, res, next) => {
  let { lang } = req.body;
  const token = req.headers?.authorization?.split(" ")[1];

  if (!lang || !(lang in response)) {
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

  try {
    User.findById(uid, "role")
      .populate("-password")
      .then((user) => {
        if (!user) {
          return ErrorHandler(res, 416, lang);
        }
        console.log(uid, user);
        req.language = user.lang;
        if (user.role.name === "admin") {
          req.language = user.lang;
          req.uid = uid;
          req.user = user;
          return next();
        } else {
          return ErrorHandler(res, 452, lang);
        }
      });
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export default AdminAuthentication;
