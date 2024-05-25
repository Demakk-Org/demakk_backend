import Jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import { config } from "dotenv";
import responsse from "../../responsse.js";
import { ResponseHandler } from "../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const AdminAuthentication = (req, res, next) => {
  let { lang } = req.body;

  const token = req.headers?.authorization?.split(" ")[1];
  const bearer = req.headers?.authorization?.split(" ")[0];

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (!token || bearer !== "Bearer") {
    console.error("Authentication failed: No token provided");
    return ResponseHandler(res, "auth", 411, lang);
  }

  const tokenValues = Jwt.decode(token, "your_secret_key");

  if (!tokenValues) {
    return ResponseHandler(res, "auth", 412, lang);
  }

  const { exp, user_id } = tokenValues;

  if (Date.now() > exp) {
    return ResponseHandler(res, "auth", 413, lang);
  }

  try {
    User.findById(user_id)
      .select("-password")
      .populate("role")
      .then((user) => {
        if (!user) {
          return ResponseHandler(res, "user", 404, lang);
        }
        console.log(user_id, user);
        if (user.role.name === "admin") {
          req.language = user.lang;
          req.uid = user_id;
          req.user = user;
          req.role = "admin";
          return next();
        } else {
          return ResponseHandler(res, "auth", 414, lang);
        }
      });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default AdminAuthentication;
