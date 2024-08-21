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
        const songIds: mongoose.Types.ObjectId[] = [];

        for (const song of songData) {
            const normalizedSongName = normalizeStringToLowerCase(song.name);
            const existingSong = await SongModel.findOne({ name: normalizedSongName }).session(session);

            if (existingSong) {
                songIds.push(existingSong._id);
            } else {
                const createdSong = await SongModel.create([song], { session });
                songIds.push(createdSong[0]._id);
            }
        }

        // Crea el álbum con el modelo correcto, asegurándote de que se usen los datos del álbum
        const album = new AlbumModel({
            ...albumData,
            songs: songIds, // Asigna las canciones creadas al álbum
        });

        const savedAlbum = await album.save({ session });

        // Commit de la transacción
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
    return searchResponseId
}

export const findAlbums = async (name: string) => {

    if(!name) {
        const searchResponceAll = await AlbumModel.find({})
        return searchResponceAll;
    }

    const searchResponseName = await AlbumModel.findOne({ name: createCaseInsensitiveRegex(name) });
    return searchResponseName;
}

export const updateAlbum = async (id: string, body: IAlbum) => {

    const searchAlbumAndUpdate = await AlbumModel.findByIdAndUpdate({_id: id}, body, {new: true})
    return searchAlbumAndUpdate
}

export const deleteAlbum = async ( id: string ) => {

    const searchAlbumAndDelete = await AlbumModel.findByIdAndDelete({_id: id})
    return searchAlbumAndDelete
}