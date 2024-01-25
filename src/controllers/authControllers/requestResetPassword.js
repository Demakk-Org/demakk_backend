import nodemailer from "nodemailer";
import resetPasswordText from "../../utils/resetPasswordText.js";
import ResetPassword from "../../models/resetPassword.js";
import queryByType from "../../utils/queryByType.js";
import User from "../../models/userSchema.js";
import language from "../../../language.js";
import dotenv from "dotenv";

const LANG = dotenv.config(process.cwd, ".env").parsed.LANG;

const requestResetPassword = async (req, res) => {
  let { account, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  const query = queryByType(account);

  if (query.status == "400") {
    return res.status(400).json({
      message: language[lang].response[403],
    });
  }

  const user = await User.findOne(query.searchQuery, "firstName");
  console.log(user);

  if (!user) {
    return res.status(400).json({ message: language[lang].response[404] });
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
            res.status(200).json({ message: language[lang].response[202] });
          });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: language[lang].response[500] });
        } finally {
          transporter.close();
        }
      } else if (query.type == "phoneNumber") {
        // function to send link to the phone
        return res.status(500).json({ message: language[lang].response[501] });
      }
    }
  );
};

export default requestResetPassword;
