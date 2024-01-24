import ProductCategory from "../../models/productCategorySchema.js";

const addProductCategory = async (req, res) => {
  const { stockItemId, name, additionalPrice, additionalCost } = req.body;

  if (!stockItemId || !name || !additionalPrice || !additionalCost) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  if (typeof stockItemId !== "string" || typeof name !== "string") {
    return res
      .status(400)
      .json({ message: "StokeItemId and Name must be type of string" });
  }

  if (
    typeof additionalPrice !== "number" ||
    typeof additionalCost !== "number"
  ) {
    return res
      .status(400)
      .json({
        message: "Additional price and Additional cost must be type of number",
      });
  }

  try {
    const productCategory = await ProductCategory.create({
      stockItem: stockItemId,
      name,
      additionalPrice,
      additionalCost,
    });

    return res
      .status(201)
      .json({
        productCategory,
        message: "Product category created successfully",
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { addProductCategory };
