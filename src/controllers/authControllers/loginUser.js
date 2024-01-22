import User from "../../models/userSchema.js";
import bcrypt from "bcryptjs"
import Jwt from "jsonwebtoken";

async function loginUser(req, res) {
  console.log(req.body)
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email })
    console.log(user)
    console.log(await bcrypt.hash(password, 10))

    if (user && await bcrypt.compare(password, user.password)) {
      const token = Jwt.sign({ from: "Demakk Printing Enterprise", uid:user._id, email:user.email, name:user.firstName, iat:Date.now() }, 'your_secret_key', {expiresIn:1000*60*60*24*30});
      res.json({ token })
    } else {
      res.status(401).json({message:"Invalid credential"});
    }
  } catch (error) {
    res.status(500).send(error.message)
  }
}

export default loginUser;