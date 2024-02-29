import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import { ErrorHandler } from "./errorHandler.js";

cloudinary.config({
  cloud_name: "dov9kdlci",
  api_key: "298462921838698",
  api_secret: config(process.cwd, ".env").parsed.CLOUDINARY_SECRET_KEY,
});

export const uploadImage = async (res, lang, imagePath) => {
  const options = {
    use_filename: true,
    unique_filename: true,
    overwrite: true,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.url;
  } catch (error) {
    console.log(error.message);
    return ErrorHandler(res, 500, lang);
  }
};
