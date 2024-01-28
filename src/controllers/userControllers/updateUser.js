import User from "../../models/userSchema.js";
import language from "../../../language.js";
import { config } from "dotenv";
import { decode } from "jsonwebtoken";
import { ObjectId } from "bson";
import Address from "../../models/addressSchema.js";
import QueryByType from "../../utils/queryByType.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
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
    (firstName && typeof firstName !== "string") ||
    (lastName && typeof lastName !== "string")
  ) {
    return res.status(400).json({ message: language[lang].response[407] });
  }

  if (
    (email && QueryByType(email, lang).status == 400) ||
    (phoneNumber && QueryByType(phoneNumber, lang).status == 400)
  ) {
    return res.status(400).json({ message: language[lang].response[403] });
  }

  if (
    (shippingAddress && !ObjectId.isValid(shippingAddress)) ||
    (billingAddress && !ObjectId.isValid(billingAddress))
  ) {
    return res.status(400).json({ message: language[lang].response[434] });
  }

  if (shippingAddress) {
    const address = await Address.findById(shippingAddress);
    if (!address) {
      return res.status(404).json({
        message: language[lang].response[408],
      });
    }

    if (address.uid.toString() !== uid) {
      return res.status(403).json({ message: language[lang].response[401] });
    }
  }

  if (billingAddress) {
    const address = await Address.findById(billingAddress);
    if (!address) {
      return res.status(404).json({
        message: language[lang].response[408],
      });
    }

    if (address.uid.toString() !== uid) {
      return res.status(403).json({ message: language[lang].response[401] });
    }
  }

  try {
    const user = await User.findById(uid).populate(
      "shippingAddress billingAddress",
      "country region city subCity"
    );

    if (firstName && firstName !== user.firstName) user.firstName = firstName;
    if (lastName && lastName !== user.lastName) user.lastName = lastName;
    if (email && email !== user.email) {
      user.email = email;
      user.emailVerified = false;
      emailVerified = false;
    }
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      user.phoneNumber = phoneNumber;
      user.phoneNumberVerified = false;
    }
    if (shippingAddress && shippingAddress !== user.shippingAddress)
      user.shippingAddress = shippingAddress;
    if (billingAddress && billingAddress !== user.billingAddress)
      user.billingAddress = billingAddress;

    await user.save();

    return res
      .status(200)
      .json({ message: language[lang].response[203], user });
  } catch (err) {
    return res.status(500).json({ message: language[lang].error[500] });
  }
};

export default updateUser;
