import mongoose from "mongoose";

const { Schema } = mongoose;

export const AddressSchema = new Schema({
  country:{
    type:String,
    required:true
  },
  city:{
    type:String,
    required:true
  },
  subCity:{
    type:String,
    required:false
  },
  woreda: {
    type:String,
    required:false
  },
  uniqueIdentifier:{
    type:String,
    required:false
  },
  streetAddress:{
    type:String,
    required:false
  },
  postalCode:{
    type:String,
    required:false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
})

const Address = mongoose.model('Address', AddressSchema)

export default Address