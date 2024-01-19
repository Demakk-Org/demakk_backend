import OTP from "../../models/otpSchema.js";
import User from "../../models/userSchema.js";

const veriftyOTP = async (req, res) => {
  const { otpID, otpValue } = req.body;

  const otp = await OTP.findById(otpID);

  if (!otp) {
    res.status(404).json({ message: "OTP not found" });
  }

  if (otp.otp != otpValue) {
    res.status(404).json({ message: "Invalid OTP" });
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
      );

      res.status(200).json({ message: "Account Verified", user });
    } else if (otp.type == "phoneNumber") {
      const user = await User.findOneAndUpdate(
        { phoneNumber: otp.account },
        {
          phoneNumberVerified: true,
        }
      );

      res.status(200).json({ message: "Account Verified", user });
    }
  }
};

export default veriftyOTP;
