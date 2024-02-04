import nodemailer from "nodemailer";
import resetPasswordText from "../../utils/resetPasswordText.js";
import ResetPassword from "../../models/resetPassword.js";
import queryByType from "../../utils/queryByType.js";
import User from "../../models/userSchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const requestResetPassword = async (req, res) => {
  let { account, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!account) {
    return ErrorHandler(res, 400, lang);
  }

  const query = queryByType(account);

  if (query.status == 403) {
    return ErrorHandler(res, 403, lang);
  }

  const user = await User.findOne(query.searchQuery, "firstName");
  console.log(user);

  if (!user) {
    return ErrorHandler(res, 404, lang);
  }

  ResetPassword.updateMany({ uid: user._id }, { status: "complete" }).then(
    async () => {
      const reset = await ResetPassword.create({
        uid: user._id,
        expiresIn: 1000 * 60 * 10,
      });

      if (query.type == "email") {
        var message = {
          from: "Demakk: ",
          to: query.searchQuery.email,
          subject: "Password Reset Request for Demakk",
          html: resetPasswordText(user.firstName, reset._id),
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
          console.log(error);
          return ErrorHandler(res, 500, lang);
        } finally {
          transporter.close();
        }
      } else if (query.type == "phoneNumber") {
        // function to send link to the phone
        return ErrorHandler(res, 501, lang);
      }
    }
  );
};

export default requestResetPassword;
