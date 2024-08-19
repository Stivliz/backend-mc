    import Bands from "../models/band.model"
    import { Request, Response } from "express"

    const getBand = async(req:Request, res:Response) => {
        try {
            const bands = await Bands.find({})
            
            if(!bands.length) return res.status(404).send("There are not bands")
            
            const band: Array<object> = []
            
            bands.forEach((e) => {
                band.push({
                    _id: e._id,
                    bandname: e.bandname,
                    genre: e.genre,
                    // themes: e.themes,
                    logoBand: e.logoBand,
                    formedDate: e.formedDate,
                    socialLinks: e.socialLinks
                })
            })

            res.status(200).json(band);
        } catch (error:unknown) {
            res.status(500).json({
                status: "failure",
                message: "Error interno del servidor",
            });
        }
    }

    export default {getBand}