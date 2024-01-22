import nodemailer from "nodemailer";
import resetPasswordText from "../../utils/resetPasswordText.js";
import ResetPassword from "../../models/resetPassword.js";
import queryByType from "../../utils/queryByType.js";
import User from "../../models/userSchema.js";

const requestResetPassword = async (req, res) => {
  const { account } = req.body;

  const query = queryByType(account);

  if (query.status == "400") {
    return res
      .status(400)
      .json({
        message:
          "Bad Request, Please Enter valid email address of phone number",
      });
  }

  const user = await User.findOne(query.searchQuery, "firstName");
  console.log(user)


  if (!user) {
    return res.status(400).json({ message: "Sign up first" });
  }

  const reset = await ResetPassword.create(query.searchQuery);

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
        res.json(response);
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ error: error.message });
    } finally {
      transporter.close();
    }
  } else if (query.type == "phoneNumber") {
    // function to send link to the phone
  }
};

export default requestResetPassword;
