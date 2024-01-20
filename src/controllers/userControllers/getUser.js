import User from "../../models/userSchema.js";

async function getUser(req, res) {
  const id = req.params?.id;

  if (!id) {
    res.status(400).send({ message: "Id is required" });
  }

  try {
    const user = await User.findById({ _id: id })
      .populate({ path: "role" })
      .populate({ path: "billingAddress" })
      .populate({ path: "shippingAddress" })
      .populate({ path: "cart"})
    console.log(user);
    res.json(user);
  } catch (error) {
    console.log(error);
  }
}

export default getUser;
