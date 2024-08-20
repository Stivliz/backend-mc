import { normalizeStringToLowerCase } from './../utils/helpers/normalizeToLowerCase';
import AlbumModel from "../models/album.model";
import SongModel from '../models/song.model';
import IAlbum from "../interfaces/interfaces";
import mongoose from 'mongoose';
import ISong from "../interfaces/interfaces";
import { createCaseInsensitiveRegex } from "../utils/helpers/createCaseInsensitiveRegex";


export const insertAlbum = async (albumData: IAlbum, songData: ISong[]) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Crear un array para almacenar los IDs de las canciones
        const songIds: mongoose.Types.ObjectId[] = [];

        for (const song of songData) {
            // Normalizar el nombre de la canción
            const normalizedSongName = normalizeStringToLowerCase(song.name);

            // Buscar canciones existentes por nombre (normalizado)
            const existingSong = await SongModel.findOne({ name: normalizedSongName }).session(session);

            if (existingSong) {
                // Si la canción existe, agregar su ID al álbum
                songIds.push(existingSong._id);
            } else {
                // Si la canción no existe, crearla y luego agregar su ID al álbum
                const createdSong = await SongModel.create([song], { session });
                songIds.push(createdSong[0]._id);
            }
        }

        // Crear el álbum con las canciones
        const album = new AlbumModel({
            ...albumData,
            songs: songIds,
        });

        const savedAlbum = await album.save({ session });

        // Commit de la transacción
        await session.commitTransaction();
        session.endSession();

        return savedAlbum;
    } catch (error) {
        // Rollback de la transacción en caso de error
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const findAlbumId = () => {

}

export const findAlbums = () => {

}

export const updateAlbum = () => {

}

export const deleteAlbum = () => {

}