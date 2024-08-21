import { Request, Response } from "express";
import mongoose from 'mongoose';
import handleHttp from "../utils/error.handler";
import { normalizeStringToLowerCase } from "../utils/helpers/normalizeToLowerCase";
import { insertAlbum, findAlbumId, findAlbums, updateAlbum, deleteAlbum} from '../services/album.service'
import ISong from "../interfaces/interfaces";

const getItemById = async ({ params }: Request, res: Response) => {
    try{

        const { id } = params;
        const responseAlbumById = await findAlbumId(id);

        if(responseAlbumById){
            res.status(200).json(responseAlbumById)
        }else{
            res.status(404).send({ message: 'The song not be could found'})
        }

    } catch ( error: any ) {
        console.error('Error al crear el álbum:', error);
        handleHttp(res, 'ERROR_GET_SONG:', error)
    }

}


const getItems = async ( req: Request, res: Response) => {
    try{
        if(req.query.albumName){
            const albumName = req.query.albumName as string;
            const lowerCaseAlbumName = normalizeStringToLowerCase(albumName)
            const responseAlbumName = await findAlbums(lowerCaseAlbumName)
        
            if(responseAlbumName){
                res.status(200).json({'message': responseAlbumName})
            } else {
                res.status(404).send({ message: 'The requested resource could not be found on the server.'})
            }
        }else{
            const allNameAlbum = await findAlbums('')
            res.status(200).json({'message': allNameAlbum})
        }
    } catch ( error: any ) {
        handleHttp(res, 'ERROR_GET_SONG:', error)
    }
}

const postItem = async ({ body }: Request, res: Response) => {

    try {

        const { songs, ...albumData } = body;
        const songData: ISong[] = songs;

        console.log('Data recibida:', body);
        console.log('Canciones procesadas:', songData);

        // Validar que todas las canciones tengan un nombre
        for (const song of songData) {
            if (!song.name || song.name.trim() === "") {
                return res.status(400).send({ message: "All songs must have a name" });
            }
        }

        const albumCreated = await insertAlbum(albumData, songData);

        if(albumCreated){
            res.status(200).send({'message': 'The Album was created'})
        }else{
            res.status(400).send({'message': 'The Album could not be created'})
        }
        
    } catch (error: any) {
        handleHttp(res, 'ERROR_GET_SONG:', error)
    }

}

const updateItem = async ({params, body}:Request, res: Response) => {
    try{
        const { id } = params;
        const updatedAlbum = await updateAlbum(id, body);

        if(updatedAlbum){
            res.status(200).send({'message': 'The Album was updated'})
        } else{
            res.status(404).send({'message': 'The Album not be could found'})
        }
    } catch( error: any) {
        handleHttp(res, 'ERROR_GET_SONG:', error)
    }

}

const deleteItem = async ({params}: Request, res: Response) => {
    try {
        const { id } = params
        const responseDeletedAlbum = await deleteAlbum(id)
        
        if(responseDeletedAlbum){
            res.status(200).send('the item been deleted.')
        }else{
            res.status(404).send('the request is not found on the server and has not been deleted.')
        }


    } catch ( error:any ) {
        handleHttp(res, 'ERROR_GET_SONG:', error)
    }
}

export default {
    getItemById,
    getItems,
    postItem,
    updateItem,
    deleteItem
}