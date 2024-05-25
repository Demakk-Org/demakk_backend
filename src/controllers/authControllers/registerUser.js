import { config } from "dotenv";
import bcrypt from "bcryptjs";

import { camelize } from "../../utils/validate.js";
import QueryByType from "../../utils/queryByType.js";
import responsse from "../../../responsse.js";

import Cart from "../../models/cartSchema.js";
import User from "../../models/userSchema.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const registerUser = async (req, res) => {
  console.log(req.body);
  let {
    account,
    firstName,
    lastName,
    password,
    confirmPassword,
    firebaseId,
    lang,
  } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (!account || !firebaseId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (password && confirmPassword && password !== confirmPassword) {
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
    firstName: firstName ? camelize(firstName) : "",
    lastName: lastName ? camelize(lastName) : "",
    password: password ? await bcrypt.hash(password, 10) : "",
    role: "65a6ee8675aa7a6c6924c260",
    cart: cart._id,
    firebaseId,
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

      return ResponseHandler(res, "auth", 201, lang);
    } catch (err) {
      console.log(err.message);
      return ResponseHandler(res, "common", 500, lang);
    }
  }
};

export default registerUser;
