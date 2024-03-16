import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { ProductCategory } from "../../models/productCategorySchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const deleteProductCategory = async (req, res) => {
  let { productCategoryId, lang } = req.body;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!productCategoryId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(productCategoryId)) {
    return ResponseHandler(res, "productCategory", 402, lang);
  }

  try {
    const productCategory = await ProductCategory.findByIdAndDelete(
      productCategoryId
    );

    if (!productCategory) {
      return ResponseHandler(res, "productCategory", 404, lang);
    }

    return ResponseHandler(res, "common", 203, lang);
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};

export { deleteProductCategory };
