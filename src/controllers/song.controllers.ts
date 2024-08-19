import { Request, Response } from "express"
import handleHttp from "../utils/error.handler"
import { insertSong, findSongs, findSongId, updateSong, deleteSong } from '../services/song.service'
import { normalizeStringToLowerCase } from "../utils/helpers/normalizeToLowerCase"




const getItemById = async ({ params} :Request, res:Response) => {
    try{
        const { id } = params;
         
        const responseSongById= await findSongId(id)

        if (responseSongById) {
            res.status(200).json(responseSongById);
        } else {
            res.status(404).send('The requested resource could not be found on the server.');
        }

    } catch(error: any) {
        handleHttp(res, 'ERROR_GET_SONG:', error)
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
    }  catch(error: any) {
        handleHttp(res, 'ERROR_GET_SONG', error)
    }
}

const postItem= async ({ body }:Request, res:Response) => {
    try {
        const responseSong = await insertSong(body);
        res.send(responseSong)
    } catch(error: any) {
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
