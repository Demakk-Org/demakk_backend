import { config } from "dotenv";
import OTP from "../../models/otpSchema.js";
import User from "../../models/userSchema.js";
import language from "../../../language.js";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";
const LANG = config(process.cwd, ".env").parsed.LANG;

const veriftyOTP = async (req, res) => {
  let { otpID, otpValue, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!otpID || !otpValue) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(otpID)) {
    return ErrorHandler(res, 448, lang);
  }

  const otp = await OTP.findById(otpID);

  if (!otp) {
    return ErrorHandler(res, 400, lang);
  }

  if (new Date(Date.now() - otp.expiresIn) > otp.createdAt) {
    return ErrorHandler(res, 406, lang);
  }

  if (otp.otp != otpValue) {
    return ErrorHandler(res, 409, lang);
  } else {
    if (otp.type == "email") {
      if (otp.status == "complete") {
        return ErrorHandler(res, 410, lang);
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

      return ErrorHandler(res, 413, lang, user);
    } else if (otp.type == "phoneNumber") {
      if (otp.status == "complete") {
        return ErrorHandler(res, 411, lang);
      }

      const user = await User.findOneAndUpdate(
        { phoneNumber: otp.account },
        {
          phoneNumberVerified: true,
        }
      ).select("phone phoneNumberVerified");

      otp.status = "complete";
      otp.save();

      return ErrorHandler(res, 412, lang, user);
    }
  }
};

export default veriftyOTP;
