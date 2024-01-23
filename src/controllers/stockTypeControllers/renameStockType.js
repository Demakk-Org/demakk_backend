import { StockType } from "../../models/stockTypeSchema.js";

const renameStockType = async (req, res) => {
  const { stockTypeName, id } = req.body;

  if (!stockTypeName || !id) {
    return res.status(400).json({
      message: "Stock Type and id are required",
    });
  }

  if (typeof stockTypeName !== "string" || typeof id !== "string") {
    return res.status(400).json({
      message: "Stock Type and id are type of strings",
    });
  }

  try {
    const stockType = await StockType.findByIdAndUpdate(
      id,
      {
        name: stockTypeName,
      },
      { returnDocument: "after" }
    );
    return res.status(200).json(stockType);
  } catch (error) {
    return res.status(500).json({ message: "Error updating stock type" });
  }
};

export default renameStockType;
