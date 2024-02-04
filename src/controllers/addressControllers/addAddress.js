import Address from "../../models/addressSchema.js";
import User from "../../models/userSchema.js";
import language from "../../../language.js";
import { config } from "dotenv";
import { decode } from "jsonwebtoken";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

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

  const token = req.headers.authorization.split(" ")[1];
  const { uid } = decode(token, "your_secret_key");

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!isValidObjectId(uid)) {
    return ErrorHandler(res, 418, lang);
  }

  if (!country || !region || !city || !subCity) {
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

      try {
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
      } catch (error) {
        console.log(error.message);
        return ErrorHandler(res, 500, lang);
      }
    });
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { addAddress };
