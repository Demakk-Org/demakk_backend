import ProductCategory from "../../models/productCategorySchema.js";

const deleteProductCategory = async (req, res) => {
  const { productCategoryId } = req.body;

  if (!productCategoryId) {
    return res.status(400).json({
      message: "Product category Id is required",
    });
  }

  if (typeof productCategoryId !== "string") {
    return res.status(400).json({
      message: "Product category Id must be a string",
    });
  }

  try {
    const productCategory = await ProductCategory.findByIdAndDelete(
      productCategoryId
    );
    if (!productCategory) {
      return res
        .status(404)
        .json({ message: "There is no product category item with this id" });
    }
    return res
      .status(200)
      .json({
        productCategory,
        message: "Product category deleted successfully",
      });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting product category" });
  }
};

export default deleteProductCategory;
