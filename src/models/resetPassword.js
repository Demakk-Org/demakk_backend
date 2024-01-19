import mongoose from "mongoose";

const {Schema} = mongoose

const reserPasswordSchema = new Schema({
  id:String,
  requestedAt:{
    type:Date,
    default:Date.now()
  },
  expiresIn:Number
})

const ResetPassword = mongoose.model("ResetPassword", reserPasswordSchema)

export default ResetPassword;