import mongoose from 'mongoose';
const {Schema, model } = mongoose;
import IAlbum from '../interfaces/interfaces'

const albumSchema = new Schema <IAlbum> ({
    name: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    songs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Song', 
        required: true 
    }],
    image: {
        type: String,
        required:true
    },
    genre: {
        type: String,
    },
    year: {
        type: Number,
        required: true
    }
})

const AlbumModel = model('Album', albumSchema);
export default AlbumModel;