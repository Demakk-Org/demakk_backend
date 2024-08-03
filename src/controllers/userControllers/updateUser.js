import { config } from "dotenv";
import { decode } from "jsonwebtoken";
import { isValidObjectId } from "mongoose";

import { ResponseHandler } from "../../utils/responseHandler.js";
import responsse from "../../../responsse.js";
import QueryByType from "../../utils/queryByType.js";

import Address from "../../models/addressSchema.js";
import User from "../../models/userSchema.js";

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
    verify,
    gender,
    address,
    shippingAddress,
    billingAddress,
  } = req.body;

  let { city, country, zipCode, streetAddress } = address;

  if (!lang || !(lang in responsse)) {
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
    !billingAddress &&
    !gender &&
    !city &&
    !country
  ) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (language && (typeof language !== "string" || language.length !== 2)) {
    return ResponseHandler(res, "common", 407, lang);
  }

  if (language && !(language in responsse)) {
    return ResponseHandler(res, "common", 408, lang);
  }

  if (
    (firstName && typeof firstName !== "string") ||
    (lastName && typeof lastName !== "string")
  ) {
    return ResponseHandler(res, "common", 406, lang);
  }

  if (
    (email &&
      (QueryByType(email, lang).status == 405 ||
        QueryByType(email, lang).type !== "email")) ||
    (phoneNumber &&
      (QueryByType(phoneNumber, lang).status == 405 ||
        QueryByType(phoneNumber, lang).type !== "phoneNumber"))
  ) {
    return ResponseHandler(res, "auth", 405, lang);
  }

  if (
    (shippingAddress && !isValidObjectId(shippingAddress)) ||
    (billingAddress && !isValidObjectId(billingAddress))
  ) {
    return ResponseHandler(res, "address", 402, lang);
  }

  if (shippingAddress) {
    const address = await Address.findById(shippingAddress);
    if (!address) {
      return ResponseHandler(res, "address", 404, lang);
    }

    if (address.uid.toString() !== uid) {
      return ResponseHandler(res, "common", 401, lang);
    }
  }

  if (gender && gender != "male" && gender != "female") {
    return ResponseHandler(res, "common", 400, lang);
  }

  if ((country && !city) || (city && !country)) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (billingAddress) {
    const address = await Address.findById(billingAddress);
    if (!address) {
      return ResponseHandler(res, "address", 404, lang);
    }

    if (address.uid.toString() !== uid) {
      return ResponseHandler(res, "common", 401, lang);
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
        return ResponseHandler(res, "auth", 418, lang);
      }

      user.email = email;
      user.emailVerified = verify ? true : false;
    }
    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      const userPhoneNumber = await User.findOne({ phoneNumber });

      if (userPhoneNumber) {
        return ResponseHandler(res, "auth", 408, lang);
      }

      user.phoneNumber = phoneNumber;
      user.phoneNumberVerified = verify ? true : false;
    }

    if (gender) user.gender = gender;
    if (address) user.address = address;

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
      gender: user.gender,
      address: user.address,
    };

    return ResponseHandler(res, "common", 202, lang, { user: data });
  } catch (err) {
    console.error(err.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export default updateUser;
