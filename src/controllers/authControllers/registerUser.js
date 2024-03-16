import { config } from "dotenv";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { camelize } from "../../utils/validate.js";
import QueryByType from "../../utils/queryByType.js";
import responsse from "../../../responsse.js";

import Cart from "../../models/cartSchema.js";
import User from "../../models/userSchema.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const registerUser = async (req, res) => {
  let { account, firstName, lastName, password, confirmPassword, lang } =
    req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (!account || !firstName || !lastName || !password || !confirmPassword) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (password !== confirmPassword) {
    return ResponseHandler(res, "auth", 404, lang);
  }

  var queryAndType = QueryByType(account, lang);

  if (queryAndType.status == 403) {
    return ResponseHandler(res, "auth", 405, lang);
  }

  const user = await User.findOne(queryAndType.searchQuery);

  console.log(user, queryAndType.type, account);

  if (user) {
    return ResponseHandler(res, "auth", 400, lang);
  }

  var cart;

  try {
    cart = await Cart.create({});
    console.log(cart);
  } catch (error) {
    console.log(error);
    return ResponseHandler(res, "common", 500, lang);
  }

  var query = {
    firstName: camelize(firstName),
    lastName: camelize(lastName),
    password: await bcrypt.hash(password, 10),
    role: "65a6ee8675aa7a6c6924c260",
    cart: cart._id,
    lang,
  };

  if (queryAndType.type == "email") {
    query.email = account;
  } else {
    query.phoneNumber = account;
  }

  console.log(query);

  if (cart) {
    try {
      const user = await User.create(query);
      cart.user = user._id;
      cart.save();

      const token = Jwt.sign(
        {
          from: "Demakk Printing Enterprise",
          uid: user._id,
          name: user.firstName,
          ...queryAndType.searchQuery,
          iat: Date.now(),
          lang,
        },
        "your_secret_key",

        { expiresIn: 1000 * 60 * 60 * 24 * 30 }
      );

      return ResponseHandler(res, "common", 201, lang, token);
    } catch (err) {
      console.log(err.message);
      return ResponseHandler(res, "common", 500, lang);
    }
  }
};

export default registerUser;
