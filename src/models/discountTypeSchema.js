import mongoose from "mongoose";

const { Schema } = mongoose;
export const discountTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  aboveAmount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const DiscountType = mongoose.model("DiscountType", discountTypeSchema);

export default DiscountType;
