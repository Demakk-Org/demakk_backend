
export class User extends Realm.Object {
  static schema = {
    name: "User",
    properties: {
      _id: { type: "objectId", default: () => new Realm.BSON.ObjectId(), mapTo:'id' },
      email: "string!",
      phoneNumber: "string!",
      firstName: "string!",
      lastName: "string!",
      role: "Role", //ref ID
      billingAddress: "BillingAdress", //ref ID
      shippingAddress: "ShippingAddress", //ref ID,
      cart: "Cart", //ref ID
      orders: "Order[]", //ref ID
      createdAt: {
        type: "date",
        default: () => new Date(),
      },
      updatedAt: "date!",
    },
    primaryKey: "_id",
  };
}
