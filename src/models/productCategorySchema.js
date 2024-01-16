
const ProductCategory = {
  name: "ProductCategory",
  properties: {
    _id: { type: "objectId!", mapTo: "id" },
    stockItem: "objectId!",//ref stock item id
    name: "string!", //ref id
    additionalPrice: "int",
    additionalCost:"int",
    createdAt: {
      type: "date",
      default: () => new Date(),
    },
    updatedAt: "date!",
  },
  primaryKey: "_id",
};