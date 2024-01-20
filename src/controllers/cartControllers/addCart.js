import Cart from "../../models/cartSchema.js";

async function addCart(req, res) {
  try {
    const cart = await Cart.create();
    res.json(cart);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
}

export default addCart;