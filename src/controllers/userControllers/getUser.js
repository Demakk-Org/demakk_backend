import User from "../../models/userSchema.js";
import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import Address from "../../models/addressSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

async function getUser(req, res) {
  let { lang } = req.body;

  const uid = req.uid;
  const userFromMiddleware = req.user;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req?.language;
  }

  if (!isValidObjectId(uid)) {
    return ResponseHandler(res, "user", 402, lang);
  }

  try {
    if (!userFromMiddleware.shippingAddress) {
      let userAddresses = await Address.find({ uid, isActive: true });

      console.log(userAddresses);

      if (userAddresses.length) {
        userAddresses.sort((a, b) => Number(b.asDefault) - Number(a.asDefault));
        userFromMiddleware.shippingAddress = userAddresses[0]._id;

        await userFromMiddleware.save();
      }
    }

    const user = await User.findById(uid)
      .select("-password -_id")
      .populate("role shippingAddress billingAddress cart image");

    return ResponseHandler(res, "common", 200, lang, { user });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
}

export default getUser;
