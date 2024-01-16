
const StockType = {
  name:"StockType",
  properties:{
    _id: { type: "objectId!", mapTo: "id" },
    name: "string!",
  },
  primaryKey: "_id",
}