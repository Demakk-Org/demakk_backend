import mongoose from "mongoose";

const { Schema } = mongoose;

const DealTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});

const DealType = mongoose.model("DealType", DealTypeSchema);

export default DealType;
