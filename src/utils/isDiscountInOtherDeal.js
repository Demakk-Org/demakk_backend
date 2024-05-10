import Deal from "../models/dealSchema.js";

export default async function isDiscountInOtherDeal(discounts, dealId) {
  const deals = await Deal.find({});
  console.log(deals, "deals");

  let exists = false;

  deals.forEach((deal) => {
    deal.discounts.forEach((discount) => {
      if (
        discounts.includes(discount.toString()) &&
        deal._id.toString() !== dealId
      ) {
        exists = true;
        return;
      }
    });
  });

  return exists;
}
