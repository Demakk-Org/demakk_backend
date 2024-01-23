import { StockType } from "../../models/stockTypeSchema.js";

const deleteStockType = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Stock Type is required",
    });
  }

  if (typeof id !== "string") {
    return res.status(400).json({
      message: "Stock Type must be a string",
    });
  }

  try {
    const stockType = await StockType.findByIdAndDelete(id);
    return res.status(200).json(stockType);
  } catch (error) {
    return res.status(500).json({ message: "Error creating stock type" });
  }
};

export default deleteStockType;
