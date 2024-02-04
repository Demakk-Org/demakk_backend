import language from "../../../language.js";
import dotenv from "dotenv";
import Address from "../../models/addressSchema.js";
import { decode } from "jsonwebtoken";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const updateAddress = async (req, res) => {
  let {
    addressId,
    country,
    region,
    city,
    subCity,
    woreda,
    uniqueIdentifier,
    streetAddress,
    postalCode,
    lang,
  } = req.body;

  const token = req.headers.authorization.split(" ")[1];
  const { uid } = decode(token, "your_secret_key");

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!addressId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(addressId)) {
    return ErrorHandler(res, 434, lang);
  }

  if (
    !country &&
    !region &&
    !city &&
    !subCity &&
    !woreda &&
    !uniqueIdentifier &&
    !streetAddress &&
    !postalCode
  ) {
    return ErrorHandler(res, 400, lang);
  }

  if (
    (country && typeof country !== "string") ||
    (region && typeof region !== "string") ||
    (city && typeof city !== "string") ||
    (subCity && typeof subCity !== "string") ||
    (woreda && typeof woreda !== "string") ||
    (uniqueIdentifier && typeof uniqueIdentifier !== "string") ||
    (streetAddress && typeof streetAddress !== "string") ||
    (postalCode && typeof postalCode !== "string")
  ) {
    return ErrorHandler(res, 407, lang);
  }

  try {
    const address = await Address.findById(addressId);
    if (!address) {
      return ErrorHandler(res, 435, lang);
    }

    if (address.uid.toString() !== uid) {
      return ErrorHandler(res, 401, lang);
    }

    if (country) address.country = country;
    if (region) address.region = region;
    if (city) address.city = city;
    if (subCity) address.subCity = subCity;
    if (woreda) address.woreda = woreda;
    if (uniqueIdentifier) address.uniqueIdentifier = uniqueIdentifier;
    if (streetAddress) address.streetAddress = streetAddress;
    if (postalCode) address.postalCode = postalCode;
    await address.save();

    return ErrorHandler(res, 203, lang, address);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { updateAddress };
