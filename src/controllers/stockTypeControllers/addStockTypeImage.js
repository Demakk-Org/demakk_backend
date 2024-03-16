import { isValidObjectId } from "mongoose";
import { config } from "dotenv";
import { uploadImage } from "../../utils/uploadImages.js";
import responsse from "../../../responsse.js";
import { ResponseHandler } from "../../utils/responseHandler.js";
import { Image } from "../../models/imageSchema.js";
import { StockType } from "../../models/stockTypeSchema.js";

const LANG = config(process.cwd, ".env").parsed.LANG;

export const addStockTypeImage = async (req, res) => {
  let image = req.files?.image;
  let { lang, stockTypeId } = req.fields;

  if (!lang || !(lang in responsse)) {
    lang = LANG;
  }

  if (req?.language) {
    lang = req.language;
  }

  if (!image || !stockTypeId) {
    return ResponseHandler(res, "common", 400, lang);
  }

  if (!isValidObjectId(stockTypeId)) {
    return ResponseHandler(res, "stockType", 402, lang);
  }

  let images = [];

  if (image.length) {
    images = [...image];
  } else {
    images = [image];
  }

  images.forEach((img) => {
    if (typeof img !== "object" || !img.name) {
      return ResponseHandler(res, "image", 408, lang);
    }
  });

  try {
    const stockType = await StockType.findById(stockTypeId);

    if (!stockType) {
      return ResponseHandler(res, "stockType", 404, lang);
    }

    uploadImage(images).then(async (data) => {
      const previousImage = await Image.findOne({
        rid: stockTypeId,
        type: "StockType",
      });

      if (previousImage) {
        previousImage.images = data;
        await previousImage.save();

        return ResponseHandler(res, "common", 203, lang, previousImage);
      }

      Image.create({
        rid: stockTypeId,
        type: "StockType",
        images: data,
      }).then(async (img) => {
        stockType.images = img._id;
        await stockType.save();

        return ResponseHandler(res, "common", 201, lang, img);
      });
    });
  } catch (error) {
    console.log(error.message);
    return ResponseHandler(res, "common", 500, lang);
  }
};
