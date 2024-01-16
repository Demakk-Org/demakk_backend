
const Coupon = {
  name:"Coupon",
  properties: {
    _id: { type: "objectId!", mapTo: "id" },
    name:"string!",
    discountType: "DiscountType!", // ref discount id
    discountAmount: "int!",
    appliesTo :"ProductCategory[]",// min 1 value
    createdAt: {
      type: "date!",
      default: () => new Date(),
    },
    upadtedAt: "date!",
    endsAt:"date"
  },
  primaryKey: "_id",
}