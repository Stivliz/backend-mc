import { normalizeStringToLowerCase } from "./../utils/helpers/normalizeToLowerCase";
import AlbumModel from "../models/album.model";
import SongModel from "../models/song.model";
import Bands from "../models/band.model";
import IAlbum from "../interfaces/interfaces";
import mongoose from "mongoose";
import { createCaseInsensitiveRegex } from "../utils/helpers/createCaseInsensitiveRegex";

export interface NameSong {
  name: string[];
}

export const insertAlbum = async (
  albumData: IAlbum,
  songs: NameSong[],
  SubId: string,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const songIds: mongoose.Types.ObjectId[] = [];

    // Usar map para manejar las operaciones asíncronas de manera paralela

    for (const song of songs) {
      // Verificar que la canción tenga un nombre válido
      if (!song.name || typeof song.name !== "string") {
        throw new Error("Cada canción debe tener un nombre válido y no vacío.");
      }

      const normalizedSongName = normalizeStringToLowerCase(song.name);
      const existingSong = await SongModel.findOne({
        name: normalizedSongName,
      }).session(session); // Asegúrate de usar la sesión

      if (existingSong) {
        songIds.push(existingSong._id);
      } else {
        const createdSong = await SongModel.create([{ name: song.name }], {
          session, // Asegúrate de usar la sesión aquí también
        });
        songIds.push(createdSong[0]._id);
      }
    }

    // Crear el álbum y asignar las canciones creadas
    const album = new AlbumModel({
      ...albumData,
      songs: songIds, // Asigna las canciones creadas
      BandId: SubId, // Id de la banda
    });

    const savedAlbum = await album.save({ session }); // Asegurarte de usar la sesión aquí

    await Bands.findByIdAndUpdate(
      SubId,
      {
        $push: { albums: savedAlbum._id },
      },
      { session },
    ); // Asegúrate de usar la sesión aquí también

    // Commit de la transacción
    await session.commitTransaction();
    session.endSession();

    return savedAlbum;
  } catch (error) {
    // Abortamos la transacción si algo falla
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const findAlbumId = async (id: string) => {
  const searchResponseId = await AlbumModel.findOne({ _id: id });
  return searchResponseId;
};

export const findAlbums = async (name: string, bandId?: string) => {
  let searchQuery: any = {};

  if (name) {
    searchQuery.name = createCaseInsensitiveRegex(name);
  }

  if (bandId) {
    searchQuery.BandId = bandId;
  }

  const searchResponse = await AlbumModel.find(searchQuery);
  return searchResponse;
};

export const updateAlbum = async (id: string, body: IAlbum) => {
  const searchAlbumAndUpdate = await AlbumModel.findByIdAndUpdate(
    { _id: id },
    body,
    { new: true },
  );
  return searchAlbumAndUpdate;
};

export const deleteAlbum = async (id: string) => {
  const searchAlbumAndDelete = await AlbumModel.findByIdAndDelete({ _id: id });
  return searchAlbumAndDelete;
};
