import StockItem from "../../models/stockItemSchema.js";

const updateStockItem = async (req, res) => {
  const { stockItemId, stockTypeId, name, price, costToProduce } = req.body;

  if (!stockItemId) {
    return res.status(400).json({ message: "Stock item Id is required" });
  }

  if (typeof stockItemId !== "string") {
    return res
      .status(400)
      .json({ message: "Stock item Id must be type of string" });
  }

  if (stockTypeId && typeof stockTypeId !== "string") {
    return res
      .status(400)
      .json({ message: "Stock type Id must be type of string" });
  }

  if (name && typeof name !== "string") {
    return res.status(400).json({ message: "Name must be type of string" });
  }

  if (price && typeof price !== "number") {
    return res.status(400).json({ message: "Price must be type of number" });
  }

  if (costToProduce && typeof costToProduce !== "number") {
    return res
      .status(400)
      .json({ message: "CostToProduce must be type of number" });
  }

  if (!stockTypeId && !name && !price && !costToProduce) {
    return res
      .status(400)
      .json({ message: "Atleast one value must be changed" });
  }

  const query = {};

  Array.from(Object.keys(req.body)).forEach((key) => {
    if (req.body[key] && key !== "stockItemId") {
      query[key] = req.body[key];
    }
  });

  console.log(query);

  try {
    const stockItem = await StockItem.findByIdAndUpdate(stockItemId, query, {
      returnDocument: "after",
    });
    if (!stockItem) {
      return res
        .status(404)
        .json({ message: "There is no stock item with this id" });
    }

    return res.status(201).json(stockItem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default updateStockItem;
