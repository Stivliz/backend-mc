import multer from 'multer'
import { Request } from 'express';
const storage = multer.diskStorage({
    filename: (req: Request, file: any, cb: any) => {
       // El nombre del archivo cambiaria por ejemplo a "1642416067890-joselito.jpg" para evitar coincidencias.
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage });

export const uploadMiddleware = upload.single('photoUser');