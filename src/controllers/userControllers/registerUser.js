import User from "../../models/userSchema.js"
import bcrypt from "bcrypt"

async function registerUser(req, res) {
  try {
    const { email, phoneNumber, firstName, lastName, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, phoneNumber, firstName, lastName, password: hashedPassword });
    await user.save()
    res.status(201).send('user registerd successfully')
  } catch (error) {
    res.status(500).send(error.message)
  }

}

export default registerUser;