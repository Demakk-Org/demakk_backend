import response from "../../../response.js";
import { config } from "dotenv";
import Address from "../../models/addressSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const deleteAddress = async (req, res) => {
  let { addressId, lang } = req.body;
  let uid = req.uid;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!addressId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(addressId)) {
    return ErrorHandler(res, 434, lang);
  }

  try {
    const address = await Address.findByIdAndDelete(addressId);

    if (!address) {
      return ErrorHandler(res, 435, lang);
    }

    if (address.uid !== uid) {
      return ErrorHandler(res, 463, lang);
    }

    return ErrorHandler(res, 204, lang);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { deleteAddress };
