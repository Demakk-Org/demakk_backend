import nodemailer from "nodemailer";
import emailText from "../../utils/emailText.js";
import OTP from "../../models/otpSchema.js";
import language from "../../../language.js";
import { config } from "dotenv";
import { decode } from "jsonwebtoken";
import User from "../../models/userSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const sendVerification = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { type } = req.body;
  const { lang, uid } = decode(token, "your-secret-key");

  if (!type) {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (type !== "email" && type !== "phoneNumber") {
    return res.status(400).json({ message: language[lang].response[400] });
  }

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  const user = await User.findById(uid)
    .select("email phoneNumber emailVerified")
    .catch((err) => {
      return res.status(500).json({ message: language[lang].response[500] });
    });

  if (type == "email" && user.emailVerified) {
    return res.status(400).json({ message: language[lang].response[410] });
  }

  if (type == "phoneNumber" && user.phoneNumberVerified) {
    return res.status(400).json({ message: language[lang].response[411] });
  }

  const otp = await OTP.updateMany(
    { account: type == "email" ? user.email : user.phoneNumber },
    { status: "complete" }
  ).catch((err) => {
    return res.status(500).json({ message: language[lang].response[500] });
  });

  var message;

  var otpKey = Math.round(Math.random() * 900000 + 100000);

  if (type == "phoneNumber") {
    //add phone number send verification
    //write the function here
    return res.status(500).json({ message: language[lang].response[501] });
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
          expiresIn: 1000 * 60 * 5, //10 minutes
        }).then((data) => {
          res.json({
            message: language[lang].response[207],
            data: {
              id: data._id,
              type: data.type,
              account: data.account,
              expiresIn: data.expiresIn,
            },
          });
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: language[lang].response[500] });
    } finally {
      transporter.close();
    }
  }
};

export default sendVerification;
