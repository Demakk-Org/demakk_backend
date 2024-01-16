
const DiscountType = {
  name:"DiscountType",
  properties:{
    _id:{type:"objectId", mapTo:"id"},
    name:"string!",
    aboveAmount:"int"//must be above zero 
  },
  primaryKey:"_id"
}