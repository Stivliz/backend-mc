import { Request, Response } from "express"
import mongoose from "mongoose";
import handleHttp from "../utils/error.handler"
import { insertSong, findSongs, getSong, updateSong, deleteSong } from '../services/song.service'
import { normalizeStringToLowerCase } from "../utils/helpers/normalizeToLowerCase"
import ISong from "../interfaces/interfaces"



const getItemById = async ({ params} :Request, res:Response) => {
    try{
        const { id } = params;
         
        const responseSongById= await getSong(id)

        responseSongById
        ? res.status(200).json(responseSongById)
        : res.status(404).send('The requested resource could not be found on the server.')

    } catch(error) {
        handleHttp(res, 'ERROR_GET_SONG')
    }
}


const getItems = async (req:Request, res:Response) => {
    try {
        if(req.query.songName){
        const  songName  = req.query.songName as string;
        const lowerCaseSongName:string = normalizeStringToLowerCase(songName);
        const responseSongName = await findSongs(lowerCaseSongName)
        
        !responseSongName == null
        ? res.status(404).send('The requested resource could not be found on the server.')
        : res.status(200).json({'message': responseSongName})

        } else {
            const responseAllSongs = await findSongs('')
            res.status(200).json({'message': responseAllSongs})
        }
    }  catch(error) {
        handleHttp(res, 'ERROR_GET_SONG')
    }
}

const postItem= async ({ body }:Request, res:Response) => {
    try {
        const responseSong = await insertSong(body);
        res.send(responseSong)
    } catch(error) {
        handleHttp(res, 'ERROR_POST_SONG', error)
    }
}

const updateItem = async ({params, body}: Request, res:Response) => {
    try{
        const { id } = params;
        
        const responseUpdatSong = await updateSong(id, body) 
        
        responseUpdatSong
        ? res.status(200).json(responseUpdatSong)
        : res.status(404).send('the request is not found on the server and has not been updated.')

    } catch(error) {
        handleHttp(res, 'ERROR_UPDATE_SONG')
    }
}

const deleteItem = async ({params}:Request, res:Response) => {
    try{
        const { id } = params;

        const responseDeletedSong = await deleteSong(id)

        responseDeletedSong
        ? res.status(200).send('the item been deleted.')
        : res.status(404).send('the request is not found on the server and has not been deleted.')

    } catch(error) {
        handleHttp(res, 'ERROR_DELETE_SONG')
    }
}


export default {
    getItemById,
    getItems,
    postItem,
    updateItem,
    deleteItem
}
