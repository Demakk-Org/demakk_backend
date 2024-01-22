import Jwt from "jsonwebtoken";
import User from "../../models/userSchema.js";

const updateAddress = async(req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const {addressId, type} = req.body
  //add type validation

  const tokenValues = Jwt.decode(token, 'your_secret_key')
  const { uid, iat, exp} = tokenValues
  
  if(!token) {
    return res.status(400).json({message:"No token provided"})
  }

  if(Date.now() > exp) {
    return res.status(400).json({message:"Token not expired"})
  }

  console.log(tokenValues, Date.now())
  

  if(!addressId || !type) {
    return res.status(400).json({message:"Credentials are not provided"})
  }

  var query;
  if(type=='shippingAddress'){query = {shippingAddress:addressId}}
  else if(type=='billingAddress'){ query = {billingAddress:addressId}}
  console.log(query)

  const user = await User.findByIdAndUpdate(uid, query, {returnDocument:'after'})

  console.log(user)

  res.json(user)
}

export default updateAddress;