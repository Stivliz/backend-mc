import express  from 'express'
import cors from 'cors'
import morgan from  'morgan'
import songs from './routes/song.route'

const app = express()

//Middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

//Routes
app.use('/', songs)

export default app;