import mongoose from "mongoose";

const {Schema} = mongoose;

const StockTypeSchema = Schema.create({
  name: {
    type: String,
    required: true,
  },
})

const StockType = mongoose.model("StockType", StockTypeSchema);

export default StockType;
