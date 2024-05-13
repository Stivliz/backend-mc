import { Request, Response } from "express"
import mongoose from "mongoose";
import handleHttp from "../utils/error.handler"
import { insertSong, findSongs, findSongById } from '../services/song.service'
import { normalizeStringToLowerCase } from "../utils/helpers/normalizeToLowerCase"
import ISong from "../interfaces/interfaces"



const getSongById = async (req:Request, res:Response) => {

    try{
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            throw new Error('Invalid ID');
        }

      const responseSongById= await findSongById(id)

      responseSongById
      ? res.status(200).json(responseSongById)
      : res.status(404).send('The requested resource could not be found on the server.')

    } catch(error) {
        handleHttp(res, 'ERROR_GET_SONG')
    }
}


const getSong = async (req:Request, res:Response) => {
    try {
        if(req.query.songName){
        const  songName  = req.query.songName as string;
        const lowerCaseSongName:string = normalizeStringToLowerCase(songName);
        const responseSongName = await findSongs(lowerCaseSongName)
        
        !responseSongName.length 
        ? res.status(404).send('The requested resource could not be found on the server.')
        : res.status(200).json({'message': responseSongName})
        }else{
            const responseAllSongs = await findSongs('')
            res.status(200).json({'message': responseAllSongs})
        }
    }  catch(error) {
        handleHttp(res, 'ERROR_GET_SONG')
    }
}

const postSong = async ({ body }:Request, res:Response) => {
    try {
        const responseSong = await insertSong(body);
        res.send(responseSong)
    } catch(error) {
        handleHttp(res, 'ERROR_POST_SONG', error)
    }
}

const updateSong = async (req:Request, res:Response) => {
    try{

    }catch(error){
        handleHttp(res, 'ERROR_UPDATE_SONG')
    }
}

const deleteSong = async (req:Request, res:Response) => {
    try{

    }catch(error){
        handleHttp(res, 'ERROR_DELETE_SONG')
    }
}


export default {
    getSongById,
    getSong,
    postSong,
    updateSong,
    deleteSong
}
