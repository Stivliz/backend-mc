import express, { Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import bcrypt from "bcrypt";

import Bands from "../models/band.model";
import 'dotenv/config';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDYNARY_NAME,
  api_key: process.env.CLOUDYNARY_KEY,
  api_secret: process.env.CLOUDYNARY_API_SECRET
});

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

router.post('/', upload.single('logoBand'), async (req: MulterRequest, res: Response) => {
    try {

      const { bandname, password, formedDate, themes } = req.body;
      const file = req.file;
        
      let hash = await bcrypt.hash(password, 10);
     
      if (!file) {
        return res.status(400).send("No file uploaded.");
      }

      // Subir imagen a Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'band_logo'
      });
    
      // Crear el usuario con la URL de la imagen subida
    const user = new Bands({
      bandname,
      password: hash,
      formedDate,
      themes,
      logoBand: result.secure_url // Guarda la URL segura de la imagen
    });

      await user.save();

      res.status(201).json({
        message: "User registered successfully",
        user
      });
    } catch (error) {
      console.error("Error during registration:", error);
      res.status(500).json({
        message: "Internal server error"
      });
    }
});

export default router;