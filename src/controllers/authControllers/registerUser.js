import QueryByType from "../../utils/queryByType.js";
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

  var queryAndType = QueryByType(account);

  if (queryAndType.status == 400) {
    return res.status(400).json({ message: queryAndType.message });
  }

  const user = await User.find(queryAndType.searchQuery);

  console.log(user, queryAndType.type, account);
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

  if (queryAndType.type == "email") {
    query.email = account;
  } else {
    query.phoneNumber = account;
  }

  console.log(query);

  if (cart) {
    try {
      const user = await User.create(query).select("_id name")
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
