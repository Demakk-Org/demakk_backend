import nodemailer from "nodemailer";
import emailText from "../../utils/emailText.js";
import OTP from "../../models/otpSchema.js";
import language from "../../../language.js";
import { config } from "dotenv";
import { decode } from "jsonwebtoken";
import User from "../../models/userSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const sendVerification = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { type } = req.body;
  const { lang, uid } = decode(token, "your-secret-key");

  if (!type) {
    return ErrorHandler(res, 400, lang);
  }

  if (type !== "email" && type !== "phoneNumber") {
    return ErrorHandler(res, 400, lang);
  }

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  const user = await User.findById(uid)
    .select("email phoneNumber emailVerified")
    .catch((err) => {
      return ErrorHandler(res, 500, lang);
    });

  if (type == "email" && user.emailVerified) {
    return ErrorHandler(res, 410, lang);
  }

  if (type == "phoneNumber" && user.phoneNumberVerified) {
    return ErrorHandler(res, 411, lang);
  }

  const otp = await OTP.updateMany(
    { account: type == "email" ? user.email : user.phoneNumber },
    { status: "complete" }
  ).catch((err) => {
    console.log(err.message);
    return ErrorHandler(res, 500, lang);
  });

  var message;

  var otpKey = Math.round(Math.random() * 900000 + 100000);

  if (type == "phoneNumber") {
    //add phone number send verification
    //write the function here
    return ErrorHandler(res, 501, lang);
  }

  if (type == "email") {
    message = {
      from: "Demakk: ",
      to: user.email,
      subject: "Demakk - Let's get you verified!",
      html: emailText(otpKey),
    };

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "melkatole1@gmail.com",
        pass: "gxwu fpjh psnj fgzz",
      },
    });

    try {
      transporter.sendMail(message).then(async (data) => {
        console.log("Message sent: %s", data.accepted);
        await OTP.create({
          type: type,
          otp: otpKey,
          account: user.email,
          expiresIn: 1000 * 60 * 5, //5 minutes
        }).then((response) => {
          const data = {
            id: response._id,
            type: response.type,
            account: response.account,
            expiresIn: response.expiresIn,
          };
          return ErrorHandler(res, 207, lang, data);
        });
      });
    } catch (error) {
      console.log(error.message);
      return ErrorHandler(res, 500, lang);
    } finally {
      transporter.close();
    }
  }
};

export default sendVerification;
