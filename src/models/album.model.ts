import mongoose from 'mongoose';
const {Schema, model } = mongoose;
import IAlbum from '../interfaces/interfaces'

const albumSchema = new Schema <IAlbum> (
    {
        name: {
            type: String,
            unique: true,
            required: true
        },
        artist: {
            type: String,
            required: true
        },
        songs: [ { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Songs' 
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
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const AlbumModel = model('Albums', albumSchema);
export default AlbumModel;