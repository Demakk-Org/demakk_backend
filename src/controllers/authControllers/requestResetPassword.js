import nodemailer from "nodemailer";
import { config } from "dotenv";
import axios from "axios";

import resetPasswordText from "../../utils/resetPasswordText.js";
import queryByType from "../../utils/queryByType.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

import ResetPassword from "../../models/resetPassword.js";
import User from "../../models/userSchema.js";

const { LANG, GEEZ_SMS_TOKEN, SHORTCODE_ID, GEEZ_SMS_URL } = config(
  process.cwd,
  ".env"
).parsed;

const requestResetPassword = async (req, res) => {
  let { account, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (!account) {
    return ResponseHandler(res, "common", 400, lang);
  }

  const query = queryByType(account);

  if (query.status == 403) {
    return ResponseHandler(res, "auth", 405, lang);
  }

  const user = await User.findOne(
    query.searchQuery,
    "firstName phoneNumber email"
  );
  console.log(user);

  if (!user) {
    return ResponseHandler(res, "user", 404, lang);
  }

  ResetPassword.updateMany({ uid: user._id }, { status: "complete" })
    .then(async () => {
      const reset = await ResetPassword.create({
        uid: user._id,
        expiresIn: 1000 * 60 * 10,
      });

      if (query.type == "email") {
        if (!user.email) {
          return ResponseHandler(res, "auth", 416, lang);
        }

        var message = {
          from: "Demakk: ",
          to: query.searchQuery.email,
          subject: "Password Reset Request for Demakk",
          html: resetPasswordText(user.firstName, reset._id, "email", lang),
        };

        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "melkatole1@gmail.com",
            pass: "wrlh gpqs mjuy kevr",
          },
        });

        try {
          transporter.sendMail(message).then(async (response) => {
            console.log("Reset message is sent!", response.response);

            return ResponseHandler(res, "auth", 203, lang);
          });
        } catch (error) {
          console.log(error.message);
          return ResponseHandler(res, "common", 500, lang);
        } finally {
          transporter.close();
        }
      } else if (query.type == "phoneNumber") {
        if (!user.phoneNumber) {
          return ResponseHandler(res, "auth", 415, lang);
        }

        var data = new FormData();

        data.append("token", GEEZ_SMS_TOKEN);
        data.append(
          "msg",
          resetPasswordText(user.firstName, reset._id, "phoneNumber", lang)
        );
        data.append("phone", user.phoneNumber);

        var config = {
          method: "post",
          url: GEEZ_SMS_URL,
          data: data,
        };
        console.log(
          resetPasswordText(user.firstName, reset._id, "phoneNumber", lang)
        );

        try {
          axios(config).then(async (resp) => {
            console.log("Reset message is sent!");
            return ResponseHandler(res, "auth", 203, lang);
          });
        } catch (error) {
          console.log(error.message);
          return ResponseHandler(res, "auth", 417, lang);
        }
      }
    })
    .catch((error) => {
      console.log(error.message);
      return ResponseHandler(res, "common", 500, lang);
    });
};

export default requestResetPassword;
