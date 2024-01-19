import nodemailer from "nodemailer";
import resetPasswordText from "../../libs/resetPasswordText.js";
import Jwt from "jsonwebtoken"
import ResetPassword from "../../models/resetPassword.js";

const requestResetPassword = async(req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization.split(" ")[1]

  const decode = Jwt.verify(token, "your_secret_key")

  const reset = await ResetPassword.create({id, expiresIn:3600})

  var  message = {
    from: "Demakk: ",
    to: decode.email,
    subject: "Password Reset Request for Demakk",
    html: resetPasswordText(decode.name, reset._id),
  };

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "melkatole1@gmail.com",
      pass: "gxwu fpjh psnj fgzz",
    },
  });

  try {
    transporter.sendMail(message)
    .then(async(response) => {
      console.log("Reset message is sent!")
      res.json(response)
    })
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: error.message });
    } finally {
      transporter.close();
    }
  }

export default requestResetPassword;