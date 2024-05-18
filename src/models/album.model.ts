import mongoose from 'mongoose';
const {Schema, model } = mongoose;
import IAlbum from '../interfaces/interfaces'

const albumSchema = new Schema <IAlbum> (
    {
        name: {
            type: String,
            required: true
        },
        artist: {
            type: String,
            required: true
        },
        songs:{ 
            type: [
                {
                id: { type: mongoose.Schema.Types.ObjectId, },
                name: {
                    type: String,
                    required: true
                },
                artist: {
                    type: String,
                    required: true
                },
                image: {
                    type: String,
                    required:true
                },
                genre: {
                    type: String,
                    required: true
                },
                year: {
                    type: Number,
                    required: true
                },
                ref: 'Songs', 
                required: true 
            }],
        },
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