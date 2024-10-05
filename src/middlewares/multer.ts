import { v2 as cloudinary } from "cloudinary";
import { Request, Response } from "express";
//import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDYNARY_NAME,
  api_key: process.env.CLOUDYNARY_KEY,
  api_secret: process.env.CLOUDYNARY_API_SECRET,
});

export const storageImageCloudinary = async (
  image: string,
): Promise<string> => {
  try {
    const resultImage = await cloudinary.uploader.upload(image, {
      folder: "Image_album",
      width: 3000,
      height: 3000,
      gravity: "faces",
      crop: "fill",
      resource_type: "image",
      allowed_formats: ["jpg", "jpeg", "png"],
      bytes_limit: 25 * 1024 * 1024,
    });
    return resultImage.secure_url;
  } catch (error) {
    throw new Error("Image upload failed");
  }
};

/* Codigo para utilizar MULTER directamente.
const storage = multer.diskStorage({
  filename: (req: Request, file: any, cb: any) => {
    // El nombre del archivo cambiaria por ejemplo a "1642416067890-joselito.jpg" para evitar coincidencias.
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

export const uploadMiddleware = upload.single("photoUser");
*/
