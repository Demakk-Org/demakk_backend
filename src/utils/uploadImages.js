import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

cloudinary.config({
  cloud_name: "dov9kdlci",
  api_key: "298462921838698",
  api_secret: config(process.cwd, ".env").parsed.CLOUDINARY_SECRET_KEY,
});

const options = {
  use_filename: true,
  unique_filename: false,
  overwrite: true,
};

export const uploadImage = (images) => {
  return new Promise((resolve, reject) => {
    let results = [];

    try {
      images.forEach(async (image) => {
        const result = await cloudinary.uploader.upload(image.path, options);
        results.push(result.public_id);

        if (results.length == images.length) {
          resolve(results);
        }
      });
    } catch (error) {
      console.log(error.message);
      reject(error);
    }
  });
};
