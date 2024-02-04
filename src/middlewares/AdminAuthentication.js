import Jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

const AdminAuthentication = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Authentication failed: No token provided" });
  }
  const tokenValues = Jwt.decode(token, "your_secret_key");

  if (!tokenValues) {
    return res
      .status(401)
      .json({ message: "Authentication failed: Invalid token" });
  }

  const { exp, uid } = tokenValues;

  if (Date.now() > exp) {
    return res
      .status(401)
      .json({ message: "Authentication failed: Token not expired" });
  }

  User.findById(uid, "role")
    .populate("role")
    .then((user) => {
      console.log(uid, user);
      if (user.role.name === "admin") {
        return next();
      } else {
        return res
          .status(401)
          .json({ message: "Authentication failed: User not admin" });
      }
    });
};

export default AdminAuthentication; //Bearer token
