import language from "../../../language.js";
import dotenv from "dotenv";
import Address from "../../models/addressSchema.js";
import { decode } from "jsonwebtoken";
import { ObjectId } from "bson";

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
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (!ObjectId.isValid(addressId)) {
    return res.status(400).json({ message: language[lang].response[434] });
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
    return res.status(400).json({ message: language[lang].response[400] });
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
    return res.status(400).json({ message: language[lang].response[407] });
  }

  try {
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: language[lang].response[435] });
    }

    if (address.uid.toString() !== uid) {
      return res.status(403).json({ message: language[lang].response[401] });
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

    return res.status(201).json({
      message: language[lang].response[203],
      address,
    });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { updateAddress };
