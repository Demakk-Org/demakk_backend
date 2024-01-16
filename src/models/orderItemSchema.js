
const OrderItem = {
  name:"OrderItem",
  properties:{
    _id: { type: "objectId!", mapTo: "id" },
    order: "objectId!", //from the order it is in
    quantity:"int!",
    unitPrice:"int!",
    couponCode:"objectId?",// refs to the coupon
    createdAt: {
      type: "date!",
      default: () => new Date(),
    },
  },
  primaryKey: "_id",
}