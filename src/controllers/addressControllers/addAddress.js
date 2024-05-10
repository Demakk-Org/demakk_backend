import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import Address from "../../models/addressSchema.js";
import User from "../../models/userSchema.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import responsse from "../../../responsse.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addAddress = async (req, res) => {
  let {
    lang,
    country,
    region,
    city,
    subCity,
    woreda,
    uniqueIdentifier,
    streetAddress,
    postalCode,
  } = req.body;

  const uid = req.uid;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!isValidObjectId(uid)) {
    return ResponseHandler(res, "user", 402, lang);
  }

  if (!country || !region || !city) {
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
    User.findById(uid).then((user) => {
      if (!user) {
        return ResponseHandler(res, "user", 404, lang);
      }

      Address.create({
        uid: user._id,
        country,
        region,
        city,
        subCity,
        woreda,
        uniqueIdentifier,
        streetAddress,
        postalCode,
      }).then((data) => {
        return ResponseHandler(res, "common", 201, lang, data);
      });
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { addAddress };
