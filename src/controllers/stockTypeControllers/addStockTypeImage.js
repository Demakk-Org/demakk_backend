import { config } from "dotenv";
import response from "../../../response.js";
import { ErrorHandler } from "../../utils/errorHandler.js";
import { isValidObjectId } from "mongoose";
import { StockType } from "../../models/stockTypeSchema.js";
import { Image } from "../../models/imageSchema.js";
import { uploadImage } from "../../utils/uploadImages.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addStockTypeImage = async (req, res) => {
  let image = req.files?.image;
  let { lang, stockTypeId } = req.fields;

  if (!lang || !(lang in response)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!image || !stockTypeId) {
    return ErrorHandler(res, 400, lang);
  }

  if (!isValidObjectId(stockTypeId)) {
    return ErrorHandler(res, 425, lang);
  }

  let images = [];

  if (image.length) {
    images = [...image];
  } else {
    images = [image];
  }

  images.forEach((img) => {
    if (typeof img !== "object" || !img.name) {
      return ErrorHandler(res, 499.3, lang);
    }
  });

  try {
    const stockType = await StockType.findById(stockTypeId);

    if (!stockType) {
      return ErrorHandler(res, 424, lang);
    }

    uploadImage(images).then(async (data) => {
      const previousImage = await Image.findOne({
        rid: stockTypeId,
        type: "StockType",
      });

      if (previousImage) {
        previousImage.images = data;
        await previousImage.save();

        return ErrorHandler(res, 203, lang, previousImage);
      }

      Image.create({
        rid: stockTypeId,
        type: "StockType",
        images: data,
      }).then(async (img) => {
        stockType.images = img._id;
        await stockType.save();

        return ErrorHandler(res, 201, lang, img);
      });
    });
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
