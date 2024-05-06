import mongoose from 'mongoose';
const {Schema, model } = mongoose;
import ISong from '../interfaces/interfaces';


const songSchema = new Schema <ISong>({
    name: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    album: {
        type:  mongoose.Schema.Types.ObjectId, ref: 'Album',
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
    }
})

const SongModel = model('Song', songSchema);

export default SongModel;