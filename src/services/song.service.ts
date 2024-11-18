import SongModel from "../models/song.model";
import AlbumModel from "../models/album.model";
import ISong from "../interfaces/interfaces";
import mongoose from "mongoose";
import Bands from "../models/band.model";
import { createCaseInsensitiveRegex } from "../utils/helpers/createCaseInsensitiveRegex";

export const insertSong = async (songData: ISong, SubId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Primero verificamos que la banda existe
    const band = await Bands.findById(SubId).session(session);
    if (!band) {
      throw new Error("Band not found");
    }

    // Creamos la nueva canción con la referencia a la banda
    const song = new SongModel({
      ...songData,
      BandId: SubId, // Aseguramos que el BandId se establece correctamente
    });

    // Guardamos la canción
    const savedSong = await song.save({ session });

    // Actualizamos la banda añadiendo la referencia a la nueva canción
    await Bands.findByIdAndUpdate(
      SubId,
      {
        $push: { songs: savedSong._id },
      },
      {
        session,
        //new: true, // Para obtener el documento actualizado
      },
    );

    // Si todo sale bien, confirmamos la transacción
    await session.commitTransaction();
    session.endSession();

    // Devolvemos la canción guardada
    return savedSong;
  } catch (error) {
    // Si algo sale mal, revertimos la transacción
    await session.abortTransaction();
    session.endSession();
    console.error("Error in insertSong:", error);
    throw error;
  }
};
/*
export const insertSong = async (songData: ISong, SubId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validación adicional de los datos
    if (!songData.name || !songData.year) {
      throw new Error("Missing required fields");
    }
    /*
    if (!songData.name || !songData.duration || !songData.year) {
      throw new Error("Missing required fields");
      }*/
// Creación del documento de la canción
/*  const song = new SongModel({
      ...songData,
      BandId: SubId,
      // Aseguramos que los tipos sean correctos
      // duration: Number(songData.duration),
      year: Number(songData.year),
      genre: Array.isArray(songData.genre) ? songData.genre : [],
    });

    // Guardado con validación
    const savedSong = await song.save({ session });

    await session.commitTransaction();
    session.endSession();

    return savedSong;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    // Mejorar el manejo de errores
    if (error instanceof mongoose.Error.ValidationError) {
      throw new Error(`Validation error: ${error.message}`);
    }
    throw error;
  }
}; */

export const findSongId = async (id: string) => {
  const searchResponseId = await SongModel.findOne({ _id: id });
  return searchResponseId;
};

export const findSongs = async (name?: string, bandId?: string) => {
  try {
    // Construir el objeto de búsqueda
    let searchQuery: any = {};

    // Filtrar por nombre de canción, si se proporciona
    if (name) {
      searchQuery.name = createCaseInsensitiveRegex(name);
    }

    // Filtrar por bandId
    if (bandId) {
      searchQuery.bandId = bandId;
    }

    // Buscar canciones independientes
    const independentSongs = await SongModel.find(searchQuery).lean().exec();

    // Buscar canciones asociadas a álbumes de la banda, con información del álbum
    const albums = await AlbumModel.find({ BandId: bandId })
      .populate<{
        songs: { songId: { _id: string; name: string; genre: string[] } }[];
      }>({
        path: "songs.songId",
        model: "Songs",
        select: "name genre",
      })
      .lean()
      .exec();

    // Formatear las canciones de los álbumes para incluir detalles adicionales
    const albumSongsWithDetails = albums.flatMap((album) =>
      album.songs
        .filter((song) => song.songId && typeof song.songId !== "string") // Filtrar canciones sin datos o solo con ObjectId
        .map((song) => ({
          _id: song.songId._id,
          name: song.songId.name,
          artist: album.artist,
          image: album.image,
          releaseType: album.releaseType,
          genre: album.genre,
          year: album.year,
          //songGenre: song.songId.genre,
        })),
    );

    console.log("SongsdesdeAlbum: ", albumSongsWithDetails);
    // Combinar canciones independientes con las canciones de álbumes formateadas
    const SongsAll = [
      ...independentSongs.map((song) => ({
        _id: song._id,
        name: song.name,
        artist: song.artist || null,
        image: null, // No hay imagen para canciones independientes
        releaseType: null,
        genre: song.year,
        year: song.genre,
      })),
      ...albumSongsWithDetails,
    ];
    console.log("Songs All -->", SongsAll);
    console.log("Canciones encontradas:", JSON.stringify(SongsAll, null, 2));
    return SongsAll;
  } catch (error) {
    console.error("Error al buscar canciones:", error);
    throw error;
  }
};
export const updateSong = async (id: string, body: ISong) => {
  const searchSongAndUpdate = await SongModel.findOneAndUpdate(
    { _id: id },
    body,
    { new: true },
  );
  return searchSongAndUpdate;
};

export const deleteSong = async (id: string) => {
  const searchSongAndDeleted = SongModel.findByIdAndDelete({ _id: id });
  return searchSongAndDeleted;
};
