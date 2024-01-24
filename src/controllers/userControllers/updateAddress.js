import Jwt from "jsonwebtoken";
import User from "../../models/userSchema.js";
import language from "../../../language.json" assert { type: "json" };

const updateAddress = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { addressId, type, lang } = req.body;

  const { uid } = Jwt.decode(token, "your_secret_key");

  console.log(typeof addressId, typeof type);

  if (!lang || !(lang in language)) {
    lang = "en";
  }

  if (
    typeof addressId != "string" ||
    typeof type != "string" ||
    !addressId ||
    !type
  ) {
    return res.status(400).json({
      message: language[lang].error[400],
    });
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
    return res.status(500).json({ message: language[lang].error[500] });
  }
};

export default updateAddress;
