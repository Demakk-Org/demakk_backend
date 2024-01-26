import { config } from "dotenv";
import OTP from "../../models/otpSchema.js";
import User from "../../models/userSchema.js";
import { ObjectId } from "bson";
import language from "../../../language.js";
const LANG = config(process.cwd, ".env").parsed.LANG;

const veriftyOTP = async (req, res) => {
  let { otpID, otpValue, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!otpID || !ObjectId.isValid(otpID)) {
    return res.status(400).json({ message: language[lang].response[407] });
  }

  const otp = await OTP.findById(otpID);

  if (!otp) {
    return res.status(404).json({ message: language[lang].response[400] });
  }

  if (new Date(Date.now() - otp.expiresIn) > otp.createdAt) {
    return res.status(406).json({ message: language[lang].response[406] });
  }

  if (otp.otp != otpValue) {
    return res.status(404).json({ message: language[lang].response[409] });
  } else {
    if (otp.type == "email") {
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

      return res
        .status(200)
        .json({ message: "Your Account is Verified", user });
    } else if (otp.type == "phoneNumber") {
      const user = await User.findOneAndUpdate(
        { phoneNumber: otp.account },
        {
          phoneNumberVerified: true,
        }
      ).select("phone phoneNumberVerified");

      otp.status = "complete";
      otp.save();

      return res
        .status(200)
        .json({ message: "Your Account is Verified", user });
    }
  }
};

export default veriftyOTP;
