import nodemailer from "nodemailer";
import emailText from "../../utils/emailText.js";
import OTP from "../../models/otpSchema.js";

const sendVerification = async (req, res) => {
  const { type, value } = req.body;
  console.log(value)
  var message
  if (!type || !value) {
    return res
      .status(400)
      .json({ message: "Please provide a phone number or email" });
  }

  if (value=='phoneNumber') {
    //add phone number send verification
    //write the function here
  }

  if (type=='email') {
    var otpKey = Math.round(Math.random() * 900000 + 100000);

    message = {
      from: "Demakk: ",
      to: value,
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
      transporter.sendMail(message)
      .then(async(response) => {
        console.log("Message sent: %s", response)
        await OTP.create({
          type: type,
          otp: otpKey,
          account: value
        }).then((response) => {
          res.json({ message: "OTP sent to your email" , response});
        })
      })
      } catch (error) {
        console.log(error);
        res.status(404).json({ error: error.message });
      } finally {
        transporter.close();
      }
    }
};

export default sendVerification;