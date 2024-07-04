import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Address from "../../models/addressSchema.js";
import { isValidObjectId } from "mongoose";
import User from "../../models/userSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const setAddressAsDefault = async (req, res) => {
  let { addressId, lang } = req.body;
  const uid = req.uid;

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
    await Address.updateMany({ uid }, { asDefault: false });

    const userRequest = User.findByIdAndUpdate(
      { _id: uid },
      { shippingAddress: addressId }
    );
    const addressRequest = Address.findByIdAndUpdate(addressId, {
      asDefault: true,
    });

    Promise.all([userRequest, addressRequest])
      .then(() => {
        return ResponseHandler(res, "common", 202, lang);
      })
      .catch((error) => {
        console.log(error);
        return ResponseHandler(res, "common", 500, lang);
      });
  } catch (error) {
    console.log(error);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { setAddressAsDefault };
