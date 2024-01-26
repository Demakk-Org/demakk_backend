import User from "../../models/userSchema.js";
import language from "../../../language.js";
import { config } from "dotenv";
import { decode } from "jsonwebtoken";
import { ObjectId } from "bson";
import Address from "../../models/addressSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateUser = async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  const tokenValues = decode(token, "your_secret_key");
  const { uid } = tokenValues;

  let {
    lang,
    firstName,
    lastName,
    email,
    phoneNumber,
    shippingAddress,
    billingAddress,
  } = req.body;

  const query = {};

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (
    !firstName &&
    !lastName &&
    !email &&
    !phoneNumber &&
    !shippingAddress &&
    !billingAddress
  ) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (
    (shippingAddress && !ObjectId.isValid(shippingAddress)) ||
    (billingAddress && !ObjectId.isValid(billingAddress))
  ) {
    return res.status(400).json({ message: language[lang].response[407] });
  }

  Array.from(Object.keys(req.body)).forEach((item) => {
    if (item) {
      query[item] = req.body[item];
    }
  });

  if (shippingAddress) {
    const address = await Address.findById(shippingAddress);
    if (!address) {
      return res.status(404).json({
        message: language[lang].response[408],
      });
    }
  }

  if (billingAddress) {
    const address = await Address.findById(billingAddress);
    if (!address) {
      return res.status(404).json({
        message: language[lang].response[408],
      });
    }
  }

  try {
    const user = await User.findByIdAndUpdate(uid, query, {
      returnDocument: "after",
    })
      .select(Array.from(Object.keys(query)).join(" "))
      .populate("shippingAddress billingAddress", "city subCity");

    return res
      .status(200)
      .json({ message: language[lang].response[203], user });
  } catch (err) {
    return res.status(500).json({ message: language[lang].error[500] });
  }
};

export default updateUser;
