import express  from 'express'
import cors from 'cors'
import morgan from  'morgan'
import songs from './routes/song.route'

import authRout from './routes/auth.route'
import authRoutPost from './routes/authPost.route'
import bandRoute from './routes/band.route'

const app = express()

//Middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

//Routes
app.use('/', songs)

//Routes
app.use('/api/v1/bands', bandRoute);

app.use('/api/v1/login/login', authRout);
app.use('/api/v1/login/register', authRoutPost);

export default app;