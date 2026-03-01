import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: `${process.env.CLOUDINARY_API_SECRET}`,
});

const uploadOnCloudinary = async (localFilePath) => {
  let shouldDeleteLocalFile = false;
  try {
    if (!localFilePath) {
      throw new Error("File path is required");
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.log("Cloudinary credentials are missing. Skipping cloud upload and using local file.");
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    shouldDeleteLocalFile = true;
    console.log("File uploaded successfully on Cloudinary", response.url);
    return response;
  } catch (error) {
    console.log("Error inside Cloudinary upload function: ", error);
    return null;
  } finally {
    if (shouldDeleteLocalFile && localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  }
};

export { uploadOnCloudinary };
