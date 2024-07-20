// import upload from "../services/multer.service";
import { Request, Response } from "express";
import { authBand } from "../services/band.service";
import jwt, { Secret } from "jsonwebtoken"

const singUp = async(req:Request, res:Response) => {
      const { bandname, password } = req.body;
      const secret:Secret | undefined = process.env.SECRET
    
    if (secret === undefined) {
      return res.status(500).send("Internal Server Error: Secret not defined");
    }

    try {
        const band = await authBand(bandname, password);

        if(!band) return res.status(404).send("Band doesn't exist!")
        const token = await jwt.sign({id:band._id}, secret)
      
        res.status(200).json({
          message: "User logged in successfully!",
          band,
          token
        });

    } catch (error: unknown ) {
        res.status(400).json({
            status: "failure",
            message: error,
        });
    }
}

// const createBandController = async(req:Request, res:Response) => {
//     try {
//       // La carga de archivos se maneja antes de llamar al servicio createBand
//       upload.single("logoBand")(req, res, async function (err) {
//         if (err) {
//           return res.status(400).send("Error al cargar el archivo");
//         }
//         const { bandname, password } = req.body;
//         const logoBand = req.file ? req.file.path : null;
  
//         await createBand({ bandname, password }, logoBand ?? '');
//         return res.status(200).send("Banda creada exitosamente");
//       });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).send("Error al crear la banda");
//     }
// }


export default { singUp}
