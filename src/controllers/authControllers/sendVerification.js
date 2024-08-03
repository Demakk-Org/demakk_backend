import axios from "axios";
import { config } from "dotenv";
import nodemailer from "nodemailer";

import emailText from "../../utils/emailText.js";
import { phoneNumberText } from "../../utils/phoneNumberText.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import OTP from "../../models/otpSchema.js";

const { LANG, GEEZ_SMS_TOKEN, SHORTCODE_ID, GEEZ_SMS_URL } = config(
  process.cwd,
  ".env"
).parsed;

const sendVerification = async (req, res) => {
  let { accountType, activation, newEmail, newPhoneNumber, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!accountType) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (accountType !== "email" && accountType !== "phoneNumber") {
    return ResponseHandler(res, "common", 400, lang);
  }

  let user = req.user;

  if (activation) {
    if (!user) {
      return ResponseHandler(res, "user", 404, lang);
    }

    if (accountType == "email" && user.emailVerified) {
      return ResponseHandler(res, "auth", 419, lang);
    }

    if (accountType == "phoneNumber" && user.phoneNumberVerified) {
      return ResponseHandler(res, "auth", 403, lang);
    }
  }

  OTP.updateMany(
    { account: accountType == "email" ? user.email : user.phoneNumber },
    { status: "complete" }
  ).catch((error) => {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  });

  var message;

  var otpKey = Math.round(Math.random() * 900000 + 100000);

  if (accountType == "phoneNumber") {
    if (!user.phoneNumber) {
      return ResponseHandler(res, "auth", 415, lang);
    }

    var data = new FormData();
    data.append("token", GEEZ_SMS_TOKEN);
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
            type: accountType,
            otp: otpKey,
            account: user.phoneNumber,
            expiresIn: 1000 * 60 * 5,
          }).then((response) => {
            const data = {
              id: response._id,
              type: response.type,
              account: response.account,
              expiresIn: response.expiresIn,
            };

            return ResponseHandler(res, "auth", 205, lang, { otp: data });
          });
        })
        .catch((error) => {
          return ResponseHandler(res, "auth", 417, lang);
        });
    } catch (err) {
      console.log(err.message);
      return ResponseHandler(res, "common", 500, lang);
    }
  }

  if (accountType == "email") {
    if (!user.email) {
      return ResponseHandler(res, 454, lang);
    }

    message = {
      from: "Demakk: ",
      to: newEmail || user.email,
      subject: "Demakk - Let's get you verified!",
      html: emailText(otpKey),
    };

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "melkatole1@gmail.com",
        pass: "oxvj ewpx pcbz utup",
      },
    });

    try {
      transporter.sendMail(message).then(async (data) => {
        await OTP.create({
          type: accountType,
          otp: otpKey,
          account: newEmail || user.email,
          expiresIn: 1000 * 60 * 5,
        }).then((response) => {
          const data = {
            id: response._id,
            type: response.type,
            account: response.account,
            expiresIn: response.expiresIn,
          };
          return ResponseHandler(res, "auth", 202, lang, { otpInfo: data });
        });
      });
    } catch (error) {
      console.log(error.message);
      return ResponseHandler(res, "common", 500, lang);
    } finally {
      transporter.close();
    }
  }
};

export default sendVerification;
