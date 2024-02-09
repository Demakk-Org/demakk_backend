import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import Order from "../../models/orderSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG

export const getOrder = async(req, res) =>{
  let { orderId, lang} = req.body

  if (!lang ||!(lang in response)) {
    lang = LANG;
  }

  if(req?.language){
    lang = req.language
  }

  if(!orderId){
    return ErrorHandler(res, 464, lang)
  }

  if(!isValidObjectId(orderId)){
    return ErrorHandler(res, 418, lang)
  }

  try {
    const order = await Order.findById(orderId)
      .populate("User OrderStatus OrderItem")
    
    return ErrorHandler(res, 200, lang, order)
  } catch (error) {
    console.log(error.message)
    return ErrorHandler(res, 500, lang)
  }
}