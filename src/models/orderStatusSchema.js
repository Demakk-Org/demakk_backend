const OrderStatus = {
  name: "OrderStatus",
  properties: {
    _id: { type: "objectId", mapTo: "id" },
    name: "string!",
  },
  primaryKey: "_id",
};
