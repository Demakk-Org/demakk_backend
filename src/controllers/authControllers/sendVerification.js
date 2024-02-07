import nodemailer from "nodemailer";
import emailText from "../../utils/emailText.js";
import OTP from "../../models/otpSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { decode } from "jsonwebtoken";
import User from "../../models/userSchema.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import axios from "axios";
import { phoneNumberText } from "../../utils/phoneNumberText.js";

const { LANG, GEEZ_SMS_TOKEN, SHORTCODE_ID, GEEZ_SMS_URL } = config(
  process.cwd,
  ".env"
).parsed;

const sendVerification = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { type } = req.body;
  const { lang, uid } = decode(token, "your-secret-key");

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (!type) {
    return ErrorHandler(res, 400, lang);
  }

  if (type !== "email" && type !== "phoneNumber") {
    return ErrorHandler(res, 400, lang);
  }

  const user = await User.findById(uid)
    .select("email phoneNumber emailVerified phoneNumberVerified")
    .catch((err) => {
      console.log(err.message);
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
    if (!user.phoneNumber) {
      return ErrorHandler(res, 453, lang);
    }
    var data = new FormData();
    data.append("token", GEEZ_SMS_TOKEN);
    // data.append("shortcode_id", SHORTCODE_ID);
    data.append("msg", phoneNumberText(otpKey, lang));
    data.append("phone", user.phoneNumber);

    var config = {
      method: "post",
      url: GEEZ_SMS_URL,
      data: data,
    };

    try {
      axios(config)
        .then(async (response) => {
          console.log(JSON.stringify(response.data));
          await OTP.create({
            type: type,
            otp: otpKey,
            account: user.phoneNumber,
            expiresIn: 1000 * 60 * 5, //5 minutes
          }).then((response) => {
            const data = {
              id: response._id,
              type: response.type,
              account: response.account,
              expiresIn: response.expiresIn,
            };
            return ErrorHandler(res, 213, lang, data);
          });
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
          return res.status(400).json({ message: err });
        });
    } catch (err) {
      console.log(err.message);
      return ErrorHandler(res, 501, lang);
    }
  }

  if (type == "email") {
    if (!user.email) {
      return ErrorHandler(res, 454, lang);
    }

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
