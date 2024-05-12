import SongModel from "../models/song.model";
import ISong from "../interfaces/interfaces";
import { createCaseInsensitiveRegex } from "../utils/helpers/createCaseInsensitiveRegex";

export const insertSong = async (song:ISong) => {
    const responseInsert = await SongModel.create(song);
    return responseInsert
}

export const  findSongs = async (name:string) => {
    const searchResponse = await SongModel.find({ name: createCaseInsensitiveRegex(name) });
    return searchResponse
}
