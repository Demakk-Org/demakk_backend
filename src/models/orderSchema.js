
const Order = {
  name:"Order",
  properties:{
    _id:{type:"objectId", mapTo:"id"},
    user:"User",//refs to userId
    orderItems:"OrderItem[]", //min 1 item // refs to list of orderitem ids 
    orderDate:"date!",
    deliveryDate:"date?",
    orderStatus:"OrderStatus",//refs to orderstatus id
    updatedAt:{
      type:"date",
      default: new Date()
    }
  }
}