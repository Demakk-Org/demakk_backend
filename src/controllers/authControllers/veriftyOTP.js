import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import User from "../../models/userSchema.js";
import OTP from "../../models/otpSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const veriftyOTP = async (req, res) => {
  let { otpID, otpValue, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (!otpID || !otpValue) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(otpID)) {
    return ResponseHandler(res, "auth", 409, lang);
  }

  const otp = await OTP.findById(otpID);

  if (!otp) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (new Date(Date.now() - otp.expiresIn) > otp.createdAt) {
    return ResponseHandler(res, "auth", 401, lang);
  }

  if (otp.otp != otpValue) {
    return ResponseHandler(res, "auth", 406, lang);
  } else {
    if (otp.type == "email") {
      if (otp.status == "complete") {
        return ResponseHandler(res, "auth", 419, lang);
      }

      const user = await User.findOneAndUpdate(
        { email: otp.account },
        {
          emailVerified: true,
        },
        {
          returnDocument: "after",
        }
      ).select("email emailVerified");

      otp.status = "complete";
      otp.save();

      return ResponseHandler(res, "auth", 204, lang, user);
    } else if (otp.type == "phoneNumber") {
      if (otp.status == "complete") {
        return ResponseHandler(res, "auth", 403, lang);
      }

      const user = await User.findOneAndUpdate(
        { phoneNumber: otp.account },
        {
          phoneNumberVerified: true,
        },
        {
          returnDocument: "after",
        }
      ).select("phone phoneNumberVerified");

      otp.status = "complete";
      otp.save();

      return ResponseHandler(res, "auth", 206, lang, user);
    }
  }
};

export default veriftyOTP;
