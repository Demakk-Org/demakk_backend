import nodemailer from "nodemailer";
import resetPasswordText from "../../utils/resetPasswordText.js";
import ResetPassword from "../../models/resetPassword.js";
import queryByType from "../../utils/queryByType.js";
import User from "../../models/userSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { ErrorHandler } from "../../utils/errorHandler.js";
import axios from "axios";

const { LANG, GEEZ_SMS_TOKEN, SHORTCODE_ID, GEEZ_SMS_URL } = config(
  process.cwd,
  ".env"
).parsed;

const requestResetPassword = async (req, res) => {
  let { account, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (!account) {
    return ErrorHandler(res, 400, lang);
  }

  const query = queryByType(account);

  if (query.status == 403) {
    return ErrorHandler(res, 403, lang);
  }

  const user = await User.findOne(query.searchQuery, "firstName phoneNumber");
  console.log(user);

  if (!user) {
    return ErrorHandler(res, 404, lang);
  }

  ResetPassword.updateMany({ uid: user._id }, { status: "complete" })
    .then(async () => {
      const reset = await ResetPassword.create({
        uid: user._id,
        expiresIn: 1000 * 60 * 10,
      });

      if (query.type == "email") {
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
            pass: "gxwu fpjh psnj fgzz",
          },
        });

        try {
          transporter.sendMail(message).then(async (response) => {
            console.log("Reset message is sent!");
            return ErrorHandler(res, 202, lang);
          });
        } catch (error) {
          console.log(error.message);
          return ErrorHandler(res, 500, lang);
        } finally {
          transporter.close();
        }
      } else if (query.type == "phoneNumber") {
        if (!user.phoneNumber) {
          return ErrorHandler(res, 453, lang);
        }
        // function to send link to the phone
        var data = new FormData();
        data.append("token", GEEZ_SMS_TOKEN);
        // data.append("shortcode_id", SHORTCODE_ID);
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
            console.log(JSON.stringify(resp.data));
            console.log("Reset message is sent!");
            return ErrorHandler(res, 202, lang);
          });
        } catch (error) {
          console.log(JSON.stringify(err));
          return ErrorHandler(res, 457, lang);
        }
      }
    })
    .catch((error) => {
      console.log(error.message);
      return ErrorHandler(res, 500, lang);
    });
};

export default requestResetPassword;
