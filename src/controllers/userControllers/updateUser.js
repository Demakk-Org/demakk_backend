import User from "../../models/userSchema.js";

const updateUser = async (req, res) => {
  const tokenValues = Jwt.decode(token, "your_secret_key");
  const { uid } = tokenValues;

  const query = {};

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    shippingAddress,
    billingAddress,
  } = req.body;

  if (
    !firstName &&
    !lastName &&
    !email &&
    !phoneNumber &&
    !shippingAddress &&
    !billingAddress
  ) {
    return res.status(400).json({ message: "Credentials are not provided" });
  }

  Array.from(Object.keys(req.body)).forEach((item) => {
    if (item) {
      query[item] = req.body[item];
    }
  });

  try {
    const user = await User.findByIdAndUpdate(uid, query, {
      returnDocument: "after",
    }).select(Array.from(Object.keys(query)).join(" "));

    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Error occured while updating the user. Try Again!" });
  }
};

export default updateUser;
