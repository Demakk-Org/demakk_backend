import Cart from "../../models/cartSchema.js";
import User from "../../models/userSchema.js";

async function addUser(req, res) {
  const {
    email,
    phoneNumber,
    firstName,
    lastName,
    password,
    role,
    billingAddress,
    shippingAddress,
  } = req.body;

  try {
    const user = await User.create({
      email,
      phoneNumber,
      firstName,
      lastName,
      role,
      billingAddress,
      shippingAddress,
    });

    res.json(user);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ error: e.message });
  }
}

export default addUser;
