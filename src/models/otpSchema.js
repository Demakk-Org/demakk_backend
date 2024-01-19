import mongoose from "mongoose";

const { Schema } = mongoose

const otpSchema = new Schema({
  type:String,
  otp:String,
  account:String,
  createdAt:{
    type:Date,
    default:Date.now
  },
})

const OTP = mongoose.model("OTP", otpSchema)

export default OTP