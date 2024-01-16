import OrderStatus from "../../models/orderStatusSchema.js";
import User from "../../models/userSchema.js";

async function addUser(req, res) {
  const {
    email,
    phoneNumber,
    firstName,
    lastName,
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
  }
}

export default addUser;
