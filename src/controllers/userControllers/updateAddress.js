import Jwt from "jsonwebtoken";
import User from "../../models/userSchema.js";
import language from "../../../language.js";
import { ObjectId } from "bson";
import Address from "../../models/addressSchema.js";

const updateAddress = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let { addressId, type, lang } = req.body;

  const { uid } = Jwt.decode(token, "your_secret_key");

  if (!lang || !(lang in language)) {
    lang = "en";
  }

  if (!ObjectId.isValid(addressId)) {
    return res.status(400).json({
      message: language[lang].response[407],
    });
  }

  if (type != "billingAddress" && type != "shippingAddress") {
    return res.status(400).json({
      message: language[lang].response[400],
    });
  }

  var query;
  if (type == "shippingAddress") {
    query = { shippingAddress: addressId };
  } else if (type == "billingAddress") {
    query = { billingAddress: addressId };
  }

  const address = await Address.findById(addressId);

  if (!address) {
    return res.status(404).json({
      message: language[lang].response[407],
    });
  }

  console.log(query);

  try {
    const user = await User.findByIdAndUpdate(uid, query, {
      returnDocument: "after",
    })
      .populate(type, "-updatedAt -createdAt -uid")
      .select(type);
    res.status(200).json({
      message: language[lang].response[203],
      data: user,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export default updateAddress;
