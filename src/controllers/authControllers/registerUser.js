import QueryByType from "../../utils/queryByType.js";
import Cart from "../../models/cartSchema.js";
import User from "../../models/userSchema.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import language from "../../../language.js";
import dotenv from "dotenv";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const camelize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

async function registerUser(req, res) {
  let { account, firstName, lastName, password, confirmPassword, role, lang } =
    req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!account || !firstName || !lastName || !password || !confirmPassword) {
    return ErrorHandler(res, 400, lang);
  }

  if (password !== confirmPassword) {
    return ErrorHandler(res, 402, lang);
  }

  var queryAndType = QueryByType(account, lang);

  if (queryAndType.status == 403) {
    return ErrorHandler(res, queryAndType.status, lang);
  }

  const user = await User.findOne(queryAndType.searchQuery);

  console.log(user, queryAndType.type, account);

  if (user) {
    return ErrorHandler(res, 405, lang);
  }

  var cart;

  try {
    cart = await Cart.create({});
    console.log(cart);
  } catch (error) {
    console.log(error);
    return ErrorHandler(res, 500, lang);
  }

  var query = {
    firstName: camelize(firstName),
    lastName: camelize(lastName),
    password: await bcrypt.hash(password, 10),
    role: "65a6ee8675aa7a6c6924c260",
    cart: cart._id,
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

      const token = Jwt.sign(
        {
          from: "Demakk Printing Enterprise",
          uid: user._id,
          name: user.firstName,
          iat: Date.now(),
          lang,
        },
        "your_secret_key",

        { expiresIn: 1000 * 60 * 60 * 24 * 30 }
      );
      return ErrorHandler(res, 201, lang, token);
    } catch (e) {
      console.log(e);
      return ErrorHandler(res, 500, lang);
    }
  }
}

export default registerUser;
