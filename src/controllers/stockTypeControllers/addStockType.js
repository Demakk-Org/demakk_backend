import { StockType } from "../../models/stockTypeSchema.js";

const addStockType = async (req, res) => {
  const { stockTypeName } = req.body;

  if (!stockTypeName) {
    return res.status(400).json({
      message: "Stock Type is required",
    });
  }

  if (typeof stockTypeName !== "string") {
    return res.status(400).json({
      message: "Stock Type must be a string",
    });
  }

  try {
    const stockType = await StockType.create({ name: stockTypeName });
    return res
      .status(201)
      .json({ stockType, message: "Stock type created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error creating stock type" });
  }
};

export default addStockType;
