import Cart from "../../models/cartSchema.js";
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

  var cart;

  try {
    cart = await Cart.create({});
    console.log(cart);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }

  if (cart) {
    try {
      const user = await User.create({
        email,
        phoneNumber,
        firstName,
        lastName,
        role,
        billingAddress,
        shippingAddress,
        cart: cart._id,
      });

      res.json(user);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: e.message });
    }
  }
}

export default addUser;
