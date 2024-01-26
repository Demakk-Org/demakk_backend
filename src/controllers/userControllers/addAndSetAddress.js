import Address from "../../models/addressSchema.js";
import User from "../../models/userSchema.js";
import language from "../../../language.js";
import { config } from "dotenv";
import { ObjectId } from "bson";
import { decode } from "jsonwebtoken";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addAddress = async (req, res) => {
  let {
    type,
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
    return res.status(400).json({ message: language[lang].response[407] });
  }

  if (!type || type !== ("shippingAddress" && "billingAddress")) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  try {
    User.findById(uid).then((user) => {
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
        }).then(async (data) => {
          if (type == "shippingAddress") {
            user.shippingAddress = data._id;
          } else if (type == "billingAddress") {
            user.billingAddress = data._id;
          }
          user.save();
          return res
            .status(200)
            .json({ message: language[lang].response[201], data });
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

export default addAddress;
