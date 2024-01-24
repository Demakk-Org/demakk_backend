import Product from "../../models/productSchema.js";

const deleteProduct = async (req, res) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({
      message: "Product Id is required",
    });
  }

  if (typeof productId !== "string") {
    return res.status(400).json({
      message: "Product Id must be a string",
    });
  }

  try {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res
        .status(404)
        .json({ message: "There is no product with this id" });
    }
    return res.status(200).json({product, message: "Product deleted successfully"});
  } catch (error) {
    return res.status(500).json({ message: "Error deleting product" });
  }
};

export { deleteProduct };
