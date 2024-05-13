import SongModel from "../models/song.model";
import ISong from "../interfaces/interfaces";
import { createCaseInsensitiveRegex } from "../utils/helpers/createCaseInsensitiveRegex";

export const insertSong = async (song:ISong) => {
    const responseInsert = await SongModel.create(song);
    return responseInsert
}


export const  findSongs = async (id: number, name:string,) => {
    
    if(id){
        const searchResponseId = await SongModel.findById(id);
        return searchResponseId;
    } 
    
    if(name){
        const searchResponseName = await SongModel.find({ name: createCaseInsensitiveRegex(name) });
        return searchResponseName;
    }
    
    const searchResponceAll = await SongModel.find()
    return searchResponceAll;
}
