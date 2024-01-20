import Cart from "../../models/cartSchema.js";
import User from "../../models/userSchema.js";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";

async function registerUser(req, res) {
  const { account, firstName, lastName, password, confirmPassword } = req.body;

  if (!account || !firstName || !lastName || !password || !confirmPassword) {
   return res.status(400).send({ message: "Missing required fields" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  var type;
  var searchQuery = {}

  if (account.match(/^2519(?:(-|\s)?)?\d{2}(?:(-|\s)?)?\d{2}(?:(-|\s)?)?\d{4}$/)) {
    type = "phoneNumber";
    searchQuery = { phoneNumber: account }
  } else if (
    account.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    type = "email";
    searchQuery = { email: account }
  } else {
    return res
      .status(400)
      .json({ message: "Enter valid phoneNumber or email address!" });
  }

  const user = await User.find(searchQuery);
  console.log(user, type, account)
  if (user.length != 0) {
    return res.status(400).json({ message: "Account already exists" });
  }

  var cart;

  try {
    cart = await Cart.create({});
    console.log(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server Error" });
  }

  var query = {
    firstName,
    lastName,
    password: await bcrypt.hash(password, 10),
    role: "65a6ee8675aa7a6c6924c260",
    cart: cart._id,
  };

  if (type == "email") {
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
        },
        "your_secret_key",
        { expiresIn: 1000 * 60 * 60 * 24 * 30 }
      );
      return res.json({ message: "User registration successful", token });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: "Server Error" });
    }
  }
}

export default registerUser;
