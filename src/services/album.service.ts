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
    const songDocuments = [];

    for (const song of songs) {
      if (!song.name || typeof song.name !== "string") {
        throw new Error("Cada canción debe tener un nombre válido y no vacío.");
      }

      const normalizedSongName = normalizeStringToLowerCase(song.name);

      let songDocument;
      const existingSong = await SongModel.findOne({
        name: normalizedSongName,
      }).session(session);

      if (existingSong) {
        console.log("Canción existente:", existingSong._id.toString());
        songDocument = existingSong;
      } else {
        const [createdSong] = await SongModel.create(
          [
            {
              name: song.name,
              BandId: SubId, // Añadimos la referencia a la banda
            },
          ],
          {
            session,
          },
        );
        console.log("Nueva canción creada:", createdSong._id.toString());
        songDocument = createdSong;
      }

      // Guardamos la estructura correcta con songId y name
      songDocuments.push({
        songId: songDocument._id,
        name: songDocument.name,
      });
    }

    // Crear el álbum con la estructura correcta de songs
    const album = new AlbumModel({
      ...albumData,
      songs: songDocuments, // Ahora guardamos el array de objetos con songId y name
      BandId: SubId,
    });

    const savedAlbum = await album.save({ session });

    // Actualizar todas las canciones con la referencia al álbum
    await SongModel.updateMany(
      { _id: { $in: songDocuments.map((song) => song.songId) } },
      { $set: { album: savedAlbum._id } },
      { session },
    );

    // Actualizar la banda
    await Bands.findByIdAndUpdate(
      SubId,
      { $push: { albums: savedAlbum._id } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return savedAlbum;
  } catch (error) {
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
  try {
    let searchQuery: any = {};

    if (name) {
      searchQuery.name = createCaseInsensitiveRegex(name);
    }

    if (bandId) {
      searchQuery.BandId = bandId;
    }

    // Obtener los álbumes con populate correcto
    const searchResponse = await AlbumModel.find(searchQuery)
      .populate({
        path: "songs.songId", // Cambiado de 'songs' a 'songs.songId'
        model: "Songs",
        select: "name",
      })
      .lean()
      .exec();

    // Formatear la respuesta para que sea más limpia
    const formattedResponse = searchResponse.map((album) => ({
      ...album,
      songs: album.songs
        .map((song) => ({
          id: song.songId?._id || song.songId,
          name: song.name,
        }))
        .filter((song) => song.name), // Filtrar canciones sin nombre
    }));

    console.log(
      "Álbumes encontrados (formateados):",
      JSON.stringify(formattedResponse, null, 2),
    );

    return formattedResponse;
  } catch (error) {
    console.error("Error al buscar álbumes:", error);
    throw error;
  }
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
