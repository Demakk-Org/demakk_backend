import Discount from "../models/discountSchema.js";

export default async function isProductInOtherDiscount(
  products,
  discountTypeId
) {
  const discounts = await Discount.find({}).populate("discountType");
  console.log(discounts, "discounts");

  let exists = false;

  discounts.forEach((discount) => {
    discount.products.forEach((product) => {
      console.log(discount.discountType._id.toString());
      if (
        products.includes(product.toString()) &&
        discount.discountType._id.toString() == discountTypeId
      ) {
        exists = true;
        return;
      }
    });
  });

  return exists;
}
