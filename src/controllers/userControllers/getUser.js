import User from "../../models/userSchema.js";
import Jwt from "jsonwebtoken";

async function getUser(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const { uid } = Jwt.decode(token, "your_secret_key");

  try {
    const user = await User.findById(uid).select(
      "email phoneNumber firstName lastName role shippingAddress billingAddress cart"
    );
    console.log(user);
    res.json(user);
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ message: "Error creating when fetching user" });
  }
}

export default getUser;
