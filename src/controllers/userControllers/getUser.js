import User from "../../models/userSchema.js";
import Jwt from 'jsonwebtoken'

async function getUser(req, res) {
  const token = req.headers.authorization.split(' ')[1];
  const tokenValues = Jwt.decode(token, 'your_secret_key')


  if (!token) {
    res.status(400).send({ message: "Token is required" });
  }

  try {
    const user = await User.findById(tokenValues.uid)
      .select("email firstName lastName role")
    console.log(user);
    res.json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({message:'Error creating when fetching user'})
  }
}

export default getUser;
