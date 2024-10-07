import { Request, Response } from "express";
import mongoose from "mongoose";
import handleHttp from "../utils/error.handler";
import { normalizeStringToLowerCase } from "../utils/helpers/normalizeToLowerCase";
import {
  insertAlbum,
  findAlbumId,
  findAlbums,
  updateAlbum,
  deleteAlbum,
} from "../services/album.service";
import ISong from "../interfaces/interfaces";
import { storageImageCloudinary } from "../middlewares/multer";

interface CustomRequest extends Request {
  decoded?: {
    sub: string;
  };
}

const getItemById = async ({ params }: Request, res: Response) => {
  try {
    const { id } = params;
    const responseAlbumById = await findAlbumId(id);

    if (responseAlbumById) {
      res.status(200).json(responseAlbumById);
    } else {
      res.status(404).send({ message: "The song not be could found" });
    }
  } catch (error: any) {
    console.error("Error al crear el álbum:", error);
    handleHttp(res, "ERROR_GET_SONG:", error);
  }
};

const getItems = async (req: CustomRequest, res: Response) => {
  try {
    if (!req.decoded || !req.decoded.sub) {
      return res.status(400).send({ message: "Missing band ID in token" });
    }

    //Si esta definido entonces guardamos ese valor en SubId
    const bandId = req.decoded.sub;

    if (req.query.albumName) {
      const albumName = req.query.albumName as string;
      const lowerCaseAlbumName = normalizeStringToLowerCase(albumName);
      const responseAlbumName = await findAlbums(lowerCaseAlbumName, bandId);

      if (responseAlbumName.length > 0) {
        res.status(200).json({ message: responseAlbumName });
      } else {
        res.status(404).send({
          message: "The requested resource could not be found on the server.",
        });
      }
    } else {
      const allAlbums = await findAlbums("", bandId);
      res.status(200).json({ message: allAlbums });
    }
  } catch (error: any) {
    handleHttp(res, "ERROR_GET_SONG:", error);
  }
};

const postItem = async (req: CustomRequest, res: Response) => {
  try {
    const { songs, image, genre, year, ...albumData } = req.body;

    // Nos aseguramos de que req.decoded (Id de la Band extraida del token en el middleware)
    // está definido antes de acceder a sub.
    if (!req.decoded || !req.decoded.sub) {
      return res.status(400).send({ message: "Missing band ID in token" });
    }

    //Si esta definido entonces guardamos ese valor en SubId
    const SubId = req.decoded.sub;
    console.log("Data recibida:", songs);

    // Validar que todas las canciones sean válidas
    if (!songs || !Array.isArray(songs) || songs.length === 0) {
      return res
        .status(400)
        .send({ message: "Songs data is missing, not valid or empty" });
    }

    if (!image) {
      return res
        .status(400)
        .send({ message: "Image is missing, not valid or empty" });
    }
    const resultImage = await storageImageCloudinary(image);

    const yearNumber = typeof year === "string" ? parseInt(year, 10) : year;

    // Asegurarse de que genre sea un arreglo
    const genreArray = Array.isArray(genre) ? genre : [genre];

    const completeAlbumData = {
      ...albumData,
      year: yearNumber, // Año como número
      genre: genreArray, // Género como array de strings
      image: resultImage,
    };

    const albumCreated = await insertAlbum(completeAlbumData, songs, SubId);
    console.log("* AlbumCreated? --->", albumCreated);
    if (albumCreated) {
      res.status(200).send({ message: "The Album was created" });
    } else {
      res.status(400).send({ message: "The Album could not be created" });
    }
  } catch (error: any) {
    handleHttp(res, "ERROR_GET_SONG:", error);
  }
};

const updateItem = async ({ params, body }: Request, res: Response) => {
  try {
    const { id } = params;
    const updatedAlbum = await updateAlbum(id, body);

    if (updatedAlbum) {
      res.status(200).send({ message: "The Album was updated" });
    } else {
      res.status(404).send({ message: "The Album not be could found" });
    }
  } catch (error: any) {
    handleHttp(res, "ERROR_GET_SONG:", error);
  }
};

const deleteItem = async ({ params }: Request, res: Response) => {
  try {
    const { id } = params;
    const responseDeletedAlbum = await deleteAlbum(id);

    if (responseDeletedAlbum) {
      res.status(200).send("the item been deleted.");
    } else {
      res
        .status(404)
        .send(
          "the request is not found on the server and has not been deleted.",
        );
    }
  } catch (error: any) {
    handleHttp(res, "ERROR_GET_SONG:", error);
  }
};

export default {
  getItemById,
  getItems,
  postItem,
  updateItem,
  deleteItem,
};
