import Address from "../../models/addressSchema.js";
import User from "../../models/userSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { decode } from "jsonwebtoken";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import { ResponseHandler } from "../../utils/responseHandler.js";

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

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!isValidObjectId(uid)) {
    return ErrorHandler(res, 418, lang);
    // return ResponseHandler(res, "user", 402, lang);
  }

  if (!country || !region || !city) {
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
    User.findById(uid).then((user) => {
      if (!user) {
        return ErrorHandler(res, 416, lang);
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
        return ErrorHandler(res, 208, lang, data);
      });
    });
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { addAddress };
