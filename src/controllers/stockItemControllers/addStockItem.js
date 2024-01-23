import StockItem from "../../models/stockItemSchema.js";

const addStockItem = async (req, res) => {
  const { stockTypeId, name, price, costToProduce } = req.body;

  if (!stockTypeId || !name || !price || !costToProduce) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  if (typeof stockTypeId !== "string" || typeof name !== "string") {
    return res
      .status(400)
      .json({ message: "StokeTypeId and Name must be type of string" });
  }

  if (typeof price !== "number" || typeof costToProduce !== "number") {
    return res
      .status(400)
      .json({ message: "Price and CostToProduce must be type of number" });
  }

  try {
    const stockItem = await StockItem.create({
      stockType: stockTypeId,
      name,
      price,
      costToProduce,
    });

    return res.status(201).json(stockItem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default addStockItem;
