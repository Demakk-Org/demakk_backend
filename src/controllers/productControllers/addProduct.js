import Product from "../../models/productSchema.js";

const addProduct = async (req, res) => {
  const { name, description, productCategoryId } = req.body;

  if (!name || !description || !productCategoryId) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  if (
    typeof description !== "string" ||
    typeof name !== "string" ||
    typeof productCategoryId !== "string"
  ) {
    return res.status(400).json({
      message:
        "Name, discription and product category id must be type of string",
    });
  }

  try {
    const product = await Product.create({
      productCategory: productCategoryId,
      name,
      description,
    });

    return res
      .status(201)
      .json({ product, message: "Product created successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { addProduct };
