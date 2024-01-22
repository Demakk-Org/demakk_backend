import Jwt from "jsonwebtoken";
import User from "../../models/userSchema.js";

const updateAddress = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { addressId, type } = req.body;

  const { uid } = Jwt.decode(token, "your_secret_key");

  if (typeof addressId === "string" || typeof type === "string") {
    return res.status(400).json({
      message: "Validation Error: addressId and type are type of string",
    });
  }

  if (!addressId || !type) {
    return res.status(400).json({ message: "Credentials are not provided" });
  }

  var query;
  if (type == "shippingAddress") {
    query = { shippingAddress: addressId };
  } else if (type == "billingAddress") {
    query = { billingAddress: addressId };
  }
  console.log(query);

  try {
    const user = await User.findByIdAndUpdate(uid, query, {
      returnDocument: "after",
    });
    res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Error occured during updating" });
  }
};

export default updateAddress;
