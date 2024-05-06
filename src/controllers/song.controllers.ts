import { Request, Response } from "express"
import mongoose from "mongoose"
import handleHttp from "../utils/error.handler"
const { insertSong } = require('../services/song')


const getSongs = async (req:Request, res:Response) => {
    try{
      

    }catch(error){
        handleHttp(res, 'ERROR_GET_SONG')
    }
}


const getSong = async (req:Request, res:Response) => {
    try{

    }catch(error){
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
    getSongs,
    getSong,
    postSong,
    updateSong,
    deleteSong
}
