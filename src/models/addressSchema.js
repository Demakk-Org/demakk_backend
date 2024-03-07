import mongoose from "mongoose";

const { Schema } = mongoose;

export const AddressSchema = new Schema(
  {
    uid: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    country: String,
    region: String,
    city: String,
    subCity: String,
    woreda: String,
    uniqueIdentifier: String,
    streetAddress: String,
    postalCode: String,
  },
  {
    timestamps: {
      updatedAt: "updatedAt",
      createdAt: "createdAt",
    },
  }
);

const Address = mongoose.model("Address", AddressSchema);

export default Address;
