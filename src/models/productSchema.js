const Products = {
  name: "Products",
  properties: {
    _id: { type: "objectId!", mapTo: "id" },
    name: "string!",
    description: "string!", //ref id
    productCategory: "ProductCategory", //ref id
    createdAt: {
      type: "date",
      default: () => new Date(),
    },
    updatedAt: "date!",
  },
  primaryKey: "_id",
};