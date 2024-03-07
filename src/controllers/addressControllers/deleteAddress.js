import { isValidObjectId } from "mongoose";
import { config } from "dotenv";

import Address from "../../models/addressSchema.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import responsse from "../../../responsse.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const deleteAddress = async (req, res) => {
  let { addressId, lang } = req.body;
  let uid = req.uid;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!addressId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(addressId)) {
    return ResponseHandler(res, "address", 402, lang);
  }

  try {
    const address = await Address.findByIdAndDelete(addressId);

    if (!address) {
      return ResponseHandler(res, "address", 404, lang);
    }

    if (address.uid.toString() !== uid) {
      return ResponseHandler(res, "address", 405, lang);
    }

    return ResponseHandler(res, "common", 204, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { deleteAddress };
