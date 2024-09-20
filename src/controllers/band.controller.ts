    import Bands from "../models/band.model"
    import { Request, Response } from "express"
    import { bandId } from "../services/band.service"

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

    const getItemById = async ({ params }: Request, res: Response) => {
        try{
            const { id } = params;
             
            const responseSongById = await bandId(id)
            
            if (responseSongById) {
                res.status(200).json(responseSongById);
            } else { 
                res.status(404).send('The requested resource could not be found on the server.');
            }
    
        } catch (error: any) {
            res.status(500).json({
                status: "failure",
                message: "Error interno del servidor",
            });
        }
    }

    const searchBand = async (req: Request, res: Response) => {
      const { _id, bandname } = req.query as { _id?: string; bandname?: string };
    
      if (!_id && !bandname) {
        return res.status(400).json({ error: 'Debes proporcionar un _id o un nombre de banda para buscar.' });
      }
    
      if (_id) {
        try {
          const item = await Bands.findById(_id);
          if (!item) {
            return res.status(404).json({ error: 'Banda no encontrada' });
          }
          return res.status(200).json(item);
        } catch (error) {
          console.error('Error fetching band by ID:', error);
          return res.status(500).json({ error: 'Error fetching band by ID' });
        }
      }
    
      if (bandname) {
        try {
          const results = await Bands.find({
            bandname: { $regex: new RegExp(bandname, 'i') }, // Case-insensitive search
          });
          if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron bandas con ese nombre.' });
          }
          return res.status(200).json(results);
        } catch (error) {
          console.error('Error fetching bands:', error);
          return res.status(500).json({ error: 'Error fetching bands' });
        }
      }
    
      return res.status(400).json({ error: 'Petición incorrecta.' });
    };

    export default {getBand, getItemById, searchBand}