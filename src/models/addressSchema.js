import mongoose from "mongoose";

const { Schema } = mongoose;

export const AddressSchema = new Schema({
  country: String,
  city: String,
  subCity: String,
  woreda: String,
  uniqueIdentifier: String,
  streetAddress: String,
  postalCode: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

const Address = mongoose.model("Address", AddressSchema);

export default Address;
