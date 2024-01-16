const Cart = {
  name: "Cart",
  properties: {
    _id: { type: "objectId!", mapTo:'id' },
    userId: "objectId!",
    orderItems:"OrderItem[]",//ref id
    updatedAt: "date!",
  },
  primaryKey: "_id",
};