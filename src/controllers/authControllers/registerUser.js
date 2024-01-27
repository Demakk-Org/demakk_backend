import QueryByType from "../../utils/queryByType.js";
import Cart from "../../models/cartSchema.js";
import User from "../../models/userSchema.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import language from "../../../language.js";
import dotenv from "dotenv";

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
    return res.status(400).send({ message: language[lang].response[400] });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: language[lang].response[402] });
  }

  var queryAndType = QueryByType(account, lang);

  if (queryAndType.status == 400) {
    return res.status(400).json({ message: queryAndType.message });
  }

  const user = await User.findOne(queryAndType.searchQuery);

  console.log(user, queryAndType.type, account);

  if (!user) {
    return res.status(400).json({ message: language[lang].response[405] });
  }

  var cart;

  try {
    cart = await Cart.create({});
    console.log(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: language[lang].response[500] });
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
          id: user._id,
          name: user.firstName,
          iat: Date.now(),
          lang,
        },
        "your_secret_key",

        { expiresIn: 1000 * 60 * 60 * 24 * 30 }
      );
      return res.json({
        message: language[lang].response[201],
        token,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: language[lang].response[500] });
    }
  }
}

export default registerUser;
