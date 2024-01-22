import nodemailer from "nodemailer";
import resetPasswordText from "../../utils/resetPasswordText.js";
import Jwt from "jsonwebtoken"
import ResetPassword from "../../models/resetPassword.js";

const requestResetPassword = async(req, res) => {
  //email from body
  //add errors
  const { account } = req.body
  

  if(!email){
    return res.status(400).json({message:'Bad Request, Please Enter your email address'})
  }

  const user = await UserActivation.find({ email})
  
  if(!user){
    return res.status(400).json({message:''})
  }

  const reset = await ResetPassword.create({})

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