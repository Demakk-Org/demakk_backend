import User from "../../models/userSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { decode } from "jsonwebtoken";
import Address from "../../models/addressSchema.js";
import QueryByType from "../../utils/queryByType.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateUser = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const tokenValues = decode(token, "your_secret_key");
  const { uid } = tokenValues;

  let {
    lang,
    language,
    firstName,
    lastName,
    email,
    phoneNumber,
    shippingAddress,
    billingAddress,
  } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req?.language;
  }

  if (
    !language &&
    !firstName &&
    !lastName &&
    !email &&
    !phoneNumber &&
    !shippingAddress &&
    !billingAddress
  ) {
    return ErrorHandler(res, 400, lang);
  }

  if (language && (typeof language !== "string" || language.length !== 2)) {
    return ErrorHandler(res, 455, lang);
  }

  if (language && !(language in response)) {
    return ErrorHandler(res, 456, lang);
  }

  if (
    (firstName && typeof firstName !== "string") ||
    (lastName && typeof lastName !== "string")
  ) {
    return ErrorHandler(res, 407, lang);
  }

  if (
    (email &&
      (QueryByType(email, lang).status == 403 ||
        QueryByType(email, lang).type !== "email")) ||
    (phoneNumber &&
      (QueryByType(phoneNumber, lang).status == 403 ||
        QueryByType(phoneNumber, lang).type !== "phoneNumber"))
  ) {
    return ErrorHandler(res, 403, lang);
  }

  if (
    (shippingAddress && !isValidObjectId(shippingAddress)) ||
    (billingAddress && !isValidObjectId(billingAddress))
  ) {
    return ErrorHandler(res, 434, lang);
  }

  if (shippingAddress) {
    const address = await Address.findById(shippingAddress);
    if (!address) {
      return ErrorHandler(res, 408, lang);
    }

    if (address.uid.toString() !== uid) {
      return ErrorHandler(res, 401, lang);
    }
  }

  if (billingAddress) {
    const address = await Address.findById(billingAddress);
    if (!address) {
      return ErrorHandler(res, 408, lang);
    }

    if (address.uid.toString() !== uid) {
      return ErrorHandler(res, 401, lang);
    }
  }

  try {
    const user = await User.findById(uid);

    if (language && language !== user.lang) user.lang = language;
    if (firstName && firstName !== user.firstName) user.firstName = firstName;
    if (lastName && lastName !== user.lastName) user.lastName = lastName;
    if (shippingAddress && shippingAddress !== user.shippingAddress)
      user.shippingAddress = shippingAddress;
    if (billingAddress && billingAddress !== user.billingAddress)
      user.billingAddress = billingAddress;
    if (email && email !== user.email) {
      const userEmail = await User.findOne({ email });

      if (userEmail) {
        return ErrorHandler(res, 458, lang);
      }

      user.email = email;
      user.emailVerified = false;
    }
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const userPhoneNumber = await User.findOne({ phoneNumber });

      if (userPhoneNumber) {
        return ErrorHandler(res, 459, lang);
      }

      user.phoneNumber = phoneNumber;
      user.phoneNumberVerified = false;
    }

    await user.save();

    const data = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      phoneNumberVerified: user.phoneNumberVerified,
      shippingAddress: user.shippingAddress,
      billingAddress: user.billingAddress,
      lang: user.lang,
    };

    return ErrorHandler(res, 203, lang, data);
  } catch (err) {
    console.error(err.message);
    return ErrorHandler(res, 500, lang);
  }
};

export default updateUser;
