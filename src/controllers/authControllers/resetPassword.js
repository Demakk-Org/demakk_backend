import ResetPassword from "../../models/resetPassword.js"
import User from "../../models/userSchema.js"
import bcrypt from "bcryptjs"


const resetPassword = async (req, res) => {
  const { id, newPassword, password } = req.body

  if(!newPassword||!password||(password!=newPassword)) {
    res.status(400).json({message:"Bad Request"})
  }

  const reset = await ResetPassword.findById(id)

  const now = new Date(Date.now()-reset.expiresIn)
  const time = reset.requestedAt

  if(now>time){
    res.status(400).json({message:"Reset Session has expired, Please try again!"})
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10) 

  await User.findByIdAndUpdate(reset.id, {
    hashedPassword
  },
  {
    returnDocument:'after'
  }).then((response)=>{
    console.log(response)
    res.json({response})
  })
  .catch((error)=>{
    res.status(error.code).json({message:error.message})
  })
}

export default resetPassword;
// $2b$10$OWBz8vjQo5GnY4e8JcX3te174RRDMgEqKnjyAfPXY9hI98FdHyZ2e