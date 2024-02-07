import { Product } from "../../models/productSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";

const LANG = config(process.cwd, ".env").parsed.LANG;

const deleteProduct = async (req, res) => {
  let { productId, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (!productId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(productId)) {
    return ErrorHandler(res, 432, lang);
  }

  try {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return ErrorHandler(res, 433, lang);
    }
    return ErrorHandler(res, 204, lang);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { deleteProduct };
