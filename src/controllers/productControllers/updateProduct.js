import Product from "../../models/productSchema.js";

const updateProduct = async (req, res) => {
  const { productId, name, description, productCategoryId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product category Id is required" });
  }

  if (typeof productId !== "string") {
    return res
      .status(400)
      .json({ message: "Product Id must be type of string" });
  }

  if (name && typeof name !== "string") {
    return res.status(400).json({ message: "Name must be type of string" });
  }

  if (description && typeof description !== "string") {
    return res
      .status(400)
      .json({ message: "Discription must be type of string" });
  }

  if (productCategoryId && typeof productCategoryId !== "string") {
    return res
      .status(400)
      .json({ message: "Product category id must be type of string" });
  }

  if (!name && !description && !productCategoryId) {
    return res
      .status(400)
      .json({ message: "Atleast one value must be changed" });
  }

  const query = {};

  Array.from(Object.keys(req.body)).forEach((key) => {
    if (req.body[key] && key !== "productId") {
      query[key] = req.body[key];
    }
  });

  console.log(query);

  try {
    const product = await Product.findByIdAndUpdate(productId, query, {
      returnDocument: "after",
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: "There is no product with this id" });
    }

    return res
      .status(201)
      .json({ product, message: "Product updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { updateProduct };
