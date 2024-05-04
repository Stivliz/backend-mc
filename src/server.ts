import 'dotenv/config'
import app from './app'
import dbConnect from './database';
const PORT = process.env.PORT || 3001;

dbConnect().then(() => console.log('server conected...'))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`)
})
