import Address from "../../models/addressSchema.js";
import User from "../../models/userSchema.js";
import language from "../../../language.js";
import { config } from "dotenv";
import { ObjectId } from "bson";
import { decode } from "jsonwebtoken";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addAddress = async (req, res) => {
  let {
    lang,
    country,
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

  if (!ObjectId.isValid(uid)) {
    return res.status(400).json({ message: language[lang].response[418] });
  }

  if (!country || !city || !subCity) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  try {
    User.findById(uid).then((user) => {
      if (!user) {
        return res.status(404).json({ message: language[lang].response[416] });
      }

      try {
        Address.create({
          uid: user._id,
          country,
          city,
          subCity,
          woreda,
          uniqueIdentifier,
          streetAddress,
          postalCode,
        }).then((data) => {
          return res
            .status(200)
            .json({ message: language[lang].response[208], data });
        });
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: language[lang].response[500] });
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.status(404).json({ message: language[lang].response[500] });
  }
};

export { addAddress };
