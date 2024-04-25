import Discount from "../models/discountSchema.js";

export default async function isProductInOtherDiscount(products) {
  const discounts = await Discount.find({});
  console.log(discounts, "discounts");

  let exists = false;

  discounts.forEach((discount) => {
    discount.products.forEach((product) => {
      if (products.includes(product.toString())) {
        exists = true;
        return;
      }
    });
  });

  return exists;
}
