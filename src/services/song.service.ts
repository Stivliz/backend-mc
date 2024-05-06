import SongModel from "../models/song.model";
import ISong from "../interfaces/interfaces";

const insertSong = async (song:ISong) => {
    const responseInsert = await SongModel.create(song);
    return responseInsert
}

const  findSongs = () => {

}

export default {
    insertSong,
    findSongs
}