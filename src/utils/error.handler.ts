import { Response } from 'express'

//Se utilizaran para optimizar el saliente de errores en los servicios o controladores.
const handleHttp = (res: Response, error: string, errorRaw?: any) => {
    console.log(errorRaw)
    res.status(500).send({error})
}

export default handleHttp;