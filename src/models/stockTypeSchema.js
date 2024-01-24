import mongoose from "mongoose";

const { Schema } = mongoose;

const StockTypeSchema = new Schema({
  name: {
    type: Map,
    of: String,
    required: true,
  },
});

const StockType = mongoose.model("StockType", StockTypeSchema);

export { StockType };
