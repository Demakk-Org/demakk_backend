import { ProductCategory } from "../../models/productCategorySchema.js";
import language from "../../../language.js";
import { config } from "dotenv";
import { isValidObjectId } from "mongoose";
import { ErrorHandler } from "../../utils/errorHandler.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

const addProductCategory = async (req, res) => {
  let { stockItemId, name, additionalPrice, additionalCost, lang } = req.body;

  if (!lang || !(lang in language)) {
    lang = LANG;
  }

  if (!stockItemId || !name || !additionalPrice || !additionalCost) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(stockItemId)) {
    return ErrorHandler(res, 428, lang);
  }

  if (
    !(name instanceof Object && name.constructor === Object) ||
    !name.lang ||
    !name.value
  ) {
    return ErrorHandler(res, 440, lang);
  }

  if (
    typeof additionalPrice !== "number" ||
    typeof additionalCost !== "number"
  ) {
    return ErrorHandler(res, 443, lang);
  }

  try {
    const productCategory = await ProductCategory.create({
      stockItem: stockItemId,
      name: { [name.lang]: name.value },
      additionalPrice,
      additionalCost,
    });

    return ErrorHandler(res, 201, lang, productCategory);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: language[lang].response[500] });
  }
};

export { addProductCategory };
