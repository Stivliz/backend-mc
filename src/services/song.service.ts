import SongModel from "../models/song.model";
import ISong from "../interfaces/interfaces";
import { createCaseInsensitiveRegex } from "../utils/helpers/createCaseInsensitiveRegex";

const insertSong = async (song:ISong) => {
    const responseInsert = await SongModel.create(song);
    return responseInsert
}

const  findSongs = async (name:ISong) => {
    const searchResponse = await SongModel.find({ name: createCaseInsensitiveRegex(name.name) })
    return searchResponse;
}

export default {
    insertSong,
    findSongs
}