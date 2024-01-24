import ProductCategory from "../../models/productCategorySchema.js";

const updateProductCategory = async (req, res) => {
  const {
    productCategoryId,
    stockItemId,
    name,
    additionalPrice,
    additionalCost,
  } = req.body;

  if (!productCategoryId) {
    return res.status(400).json({ message: "Product category Id is required" });
  }

  if (typeof productCategoryId !== "string") {
    return res
      .status(400)
      .json({ message: "Product category  Id must be type of string" });
  }

  if (stockItemId && typeof stockItemId !== "string") {
    return res
      .status(400)
      .json({ message: "Stock item Id must be type of string" });
  }

  if (name && typeof name !== "string") {
    return res.status(400).json({ message: "Name must be type of string" });
  }

  if (additionalPrice && typeof additionalPrice !== "number") {
    return res.status(400).json({ message: "Price must be type of number" });
  }

  if (additionalCost && typeof additionalCost !== "number") {
    return res
      .status(400)
      .json({ message: "CostToProduce must be type of number" });
  }

  if (!stockItemId && !name && !additionalPrice && !additionalCost) {
    return res
      .status(400)
      .json({ message: "Atleast one value must be changed" });
  }

  const query = {};

  Array.from(Object.keys(req.body)).forEach((key) => {
    if (req.body[key] && key !== "productCategoryId") {
      query[key] = req.body[key];
    }
  });

  console.log(query);

  try {
    const productCategory = await ProductCategory.findByIdAndUpdate(
      productCategoryId,
      query,
      {
        returnDocument: "after",
      }
    );
    if (!productCategory) {
      return res
        .status(404)
        .json({ message: "There is no stock item with this id" });
    }

    return res
      .status(201)
      .json({
        productCategory,
        message: "Product category updated successfully.",
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default updateProductCategory;
