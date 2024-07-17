import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import Address from "../../models/addressSchema.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const updateAddress = async (req, res) => {
  let {
    addressId,
    contactName,
    phoneNumber,
    country,
    region,
    city,
    subCity,
    woreda,
    uniqueIdentifier,
    streetAddress,
    postalCode,
    asDefault,
    lang,
  } = req.body;

  const uid = req.uid;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req?.language;
  }

  if (!addressId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(addressId)) {
    return ResponseHandler(res, "address", 402, lang);
  }

  if (
    !contactName &&
    !phoneNumber &&
    !country &&
    !region &&
    !city &&
    !subCity &&
    !woreda &&
    !uniqueIdentifier &&
    !streetAddress &&
    !postalCode
  ) {
    return ResponseHandler(res, "common", 400, lang);
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
    return ResponseHandler(res, "common", 406, lang);
  }

  try {
    const address = await Address.findById(addressId);

    if (!address) {
      return ResponseHandler(res, "address", 404, lang);
    }

    if (address.uid.toString() !== uid.toString()) {
      return ResponseHandler(res, "address", 405, lang);
    }

    if (contactName) address.contactName = contactName;
    if (phoneNumber) address.phoneNumber = phoneNumber;
    if (country) address.country = country;
    if (region) address.region = region;
    if (city) address.city = city;
    if (subCity) address.subCity = subCity;
    if (woreda) address.woreda = woreda;
    if (uniqueIdentifier) address.uniqueIdentifier = uniqueIdentifier;
    if (streetAddress) address.streetAddress = streetAddress;
    if (postalCode) address.postalCode = postalCode;
    if (asDefault || typeof asDefault == "boolean")
      address.asDefault = asDefault;

    await address.save().then(() => {
      return ResponseHandler(res, "common", 202, lang);
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { updateAddress };
