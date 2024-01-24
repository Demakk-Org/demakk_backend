import StockItem from "../../models/stockItemSchema.js";

const deleteStockItem = async (req, res) => {
  const { stockItemId } = req.body;

  if (!stockItemId) {
    return res.status(400).json({
      message: "Stock Item is required",
    });
  }

  if (typeof stockItemId !== "string") {
    return res.status(400).json({
      message: "Stock Item must be a string",
    });
  }

  try {
    const stockItem = await StockItem.findByIdAndDelete(stockItemId);
    if (!stockItem) {
      return res
        .status(404)
        .json({ message: "There is no stock item with this id" });
    }
    return res
      .status(200)
      .json({ stockItem, message: "Stock Item deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting stock type" });
  }
};

export default deleteStockItem;
