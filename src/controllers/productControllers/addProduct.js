import { Product } from "../../models/productSchema.js";
import response from "../../../response.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addProduct = async (req, res) => {
  let { name, description, productCategoryId, lang } = req.body;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!name || !description || !productCategoryId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(productCategoryId)) {
    return ErrorHandler(res, 437, lang);
  }

  if (
    !(name instanceof Object && name.constructor === Object) ||
    !name.lang ||
    !name.value
  ) {
    return ErrorHandler(res, 440, lang);
  }

  if (
    !(description instanceof Object && description.constructor === Object) ||
    !description.lang ||
    !description.value
  ) {
    return ErrorHandler(res, 442, lang);
  }

  try {
    const product = await Product.create({
      name: { [name.lang]: name.value },
      description: { [description.lang]: description.value },
      productCategory: productCategoryId,
    });

    return ErrorHandler(res, 200, lang, product);
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};

export { addProduct };
