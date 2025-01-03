import { Response } from 'express'

//Se utilizaran para optimizar el saliente de errores en los servicios o controladores.
const handleHttp = (res: Response, errorRaw?: any, error?: string) => {
    console.log('error:', [errorRaw, { error}] )
    res.status(500).send([errorRaw, { error}])
}

export default handleHttp;