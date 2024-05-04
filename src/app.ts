import express  from 'express'
import cors from 'cors'
import morgan from  'morgan'

const app = express()

//Middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())


export default app;