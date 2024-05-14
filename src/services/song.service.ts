import SongModel from "../models/song.model";
import ISong from "../interfaces/interfaces";
import { createCaseInsensitiveRegex } from "../utils/helpers/createCaseInsensitiveRegex";

export const insertSong = async ( song:ISong ) => {
    const responseInsert = await SongModel.create(song);
    return responseInsert
}


export const getSong = async ( id: string ) => {

    const searchResponseId = await SongModel.findOne({_id: id});
    return searchResponseId;
 
}


export const  findSongs = async ( name:string ) => {

    if(!name) {
        const searchResponceAll = await SongModel.find({})
        return searchResponceAll;
    }

    const searchResponseName = await SongModel.findOne({ name: createCaseInsensitiveRegex(name) });
    return searchResponseName
       
}


export const updateSong = async ( id: string, body: ISong ) => {

    const searchSongAndUpdate = await SongModel.findOneAndUpdate({_id: id}, body, {new: true})
    return searchSongAndUpdate;

}


export const deleteSong = async ( id: string ) => {

    const searchSongAndDeleted = SongModel.findByIdAndDelete({_id: id})
    return searchSongAndDeleted;
}