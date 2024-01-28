import language from "../../../language.js";
import dotenv from "dotenv";
import { ObjectId } from "bson";
import Address from "../../models/addressSchema.js";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const deleteAddress = async (req, res) => {
  let { addressId, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }
  if (!addressId) {
    return res.status(400).json({
      message: language[lang].response[400],
    });
  }

  if (!ObjectId.isValid(addressId)) {
    return res.status(400).json({ message: language[lang].response[434] });
  }

  try {
    const address = await Address.findByIdAndDelete(addressId);

    if (!address) {
      return res.status(404).json({ message: language[lang].response[435] });
    }

    return res.status(200).json({ message: language[lang].response[204] });
  } catch (error) {
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { deleteAddress };
