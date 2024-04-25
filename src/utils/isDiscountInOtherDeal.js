import Deal from "../models/dealSchema.js";

export default async function isDiscountInOtherDeal(discounts) {
  const deals = await Deal.find({});
  console.log(deals, "deals");

  let exists = false;

  deals.forEach((deal) => {
    deal.discounts.forEach((discount) => {
      if (discounts.includes(discount.toString())) {
        exists = true;
        return;
      }
    });
  });

  return exists;
}
