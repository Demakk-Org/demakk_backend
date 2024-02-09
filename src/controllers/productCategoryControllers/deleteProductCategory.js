import { ProductCategory } from "../../models/productCategorySchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const deleteProductCategory = async (req, res) => {
  let { productCategoryId, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!productCategoryId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(productCategoryId)) {
    return ErrorHandler(res, 430, lang);
  }

  try {
    const productCategory = await ProductCategory.findByIdAndDelete(
      productCategoryId
    );

    if (!productCategory) {
      return ErrorHandler(res, 431, lang);
    }
    return ErrorHandler(res, 204, lang);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { deleteProductCategory };
