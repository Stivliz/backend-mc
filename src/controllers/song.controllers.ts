import { Request, Response } from "express";
import handleHttp from "../utils/error.handler";
import {
  insertSong,
  findSongs,
  findSongId,
  updateSong,
  deleteSong,
} from "../services/song.service";
import { normalizeStringToLowerCase } from "../utils/helpers/normalizeToLowerCase";
import { storageImageCloudinary } from "../middlewares/multer";

interface CustomRequest extends Request {
  decoded?: {
    sub: string;
  };
}

const getItemById = async ({ params }: Request, res: Response) => {
  try {
    const { id } = params;

    const responseSongById = await findSongId(id);

    if (responseSongById) {
      res.status(200).json(responseSongById);
    } else {
      res
        .status(404)
        .send("The requested resource could not be found on the server.");
    }
  } catch (error: any) {
    handleHttp(res, "ERROR_GET_SONG:", error);
  }
};

const getItems = async (req: Request, res: Response) => {
  try {
    if (req.query.songName) {
      const songName = req.query.songName as string;
      const lowerCaseSongName: string = normalizeStringToLowerCase(songName);
      const responseSongName = await findSongs(lowerCaseSongName);

      !responseSongName
        ? res
            .status(404)
            .send("The requested resource could not be found on the server.")
        : res.status(200).json({ message: responseSongName });
    } else {
      const responseAllSongs = await findSongs("");
      res.status(200).json({ message: responseAllSongs });
    }
  } catch (error: any) {
    handleHttp(res, "ERROR_GET_SONG", error);
  }
};

const postItem = async (req: CustomRequest, res: Response) => {
  try {
    const { name, image, year, genre, ...songData } = req.body;
    if (!req.decoded || !req.decoded.sub) {
      return res.status(400).send({ message: "Missing band ID in token" });
    }

    const bandId = req.decoded.sub;

    if (!image) {
      return res
        .status(400)
        .send({ message: "Image is missing, not valid or empty" });
    }

    const resultImage = await storageImageCloudinary(image);

    const yearNumber = typeof year === "string" ? parseInt(year, 10) : year;

    const genreArray = Array.isArray(genre) ? genre : [genre];

    const completeSongData = {
      ...songData,
      year: yearNumber, // Año como número
      genre: genreArray, // Género como array de strings
      image: resultImage,
    };

    const responseSong = await insertSong(completeSongData, bandId);
    if (responseSong) {
      res.status(200).send({ message: "The song was created" });
    } else {
      res.status(400).send({ message: "The song could not be created" });
    }
  } catch (error: any) {
    handleHttp(res, "ERROR_POST_SONG", error);
  }
};

const updateItem = async ({ params, body }: Request, res: Response) => {
  try {
    const { id } = params;

    const responseUpdatSong = await updateSong(id, body);

    responseUpdatSong
      ? res.status(202).json({
          message: "Song updated successfully",
          song: responseUpdatSong,
        })
      : res
          .status(404)
          .send(
            "The requested resource was not found on the server and could not be updated.",
          );
  } catch (error) {
    handleHttp(res, "ERROR_UPDATE_SONG");
  }
};

const deleteItem = async ({ params }: Request, res: Response) => {
  try {
    const { id } = params;

    const responseDeletedSong = await deleteSong(id);

    responseDeletedSong
      ? res.status(200).send("the item been deleted.")
      : res
          .status(404)
          .send(
            "the request is not found on the server and has not been deleted.",
          );
  } catch (error) {
    handleHttp(res, "ERROR_DELETE_SONG");
  }
};

export default {
  getItemById,
  getItems,
  postItem,
  updateItem,
  deleteItem,
};
