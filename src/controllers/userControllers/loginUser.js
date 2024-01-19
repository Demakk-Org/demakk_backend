import User from "../../models/userSchema.js";
import bcrypt from "bcrypt"
import Jwt from "jsonwebtoken";

async function loginUser(req, res) {

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    console.log(user)

    if (user && await bcrypt.compare(password, user.password)) {
      const token = Jwt.sign({ password: user.password }, 'your_secret_key');
      console.log(token)
      res.json({ token })
    } else {
      res.status(401).send("invalid credential");
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
}

export default loginUser;