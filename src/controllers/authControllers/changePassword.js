import User from "../../models/userSchema.js";
import bcrypt from "bcryptjs";
import Jwt from 'jsonwebtoken'

const changePassword = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const { uid } = Jwt.decode(token, "your_secret_key");

  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return res
      .status(400)
      .json({ message: "Password and confirm password are required" });
  }

  if (password != confirmPassword) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  try {
    const user = await User.findById(uid).select("password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default changePassword;
