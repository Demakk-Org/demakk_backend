import { Product } from "../../models/productSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const deleteProduct = async (req, res) => {
  let { productId, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!productId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(productId)) {
    return ResponseHandler(res, "product", 402, lang);
  }

  try {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      //return ErrorHandler(res, 433, lang);
      return ResponseHandler(res, "product", 404, lang);
    }
    //return ErrorHandler(res, 204, lang);
    return ResponseHandler(res, "common", 203, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { deleteProduct };
