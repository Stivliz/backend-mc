import mongoose from "mongoose";
const { Schema, model } = mongoose;
import ISong from "../interfaces/interfaces";

const songSchema = new Schema<ISong>(
  {
    BandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "band",
      required: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    artist: {
      type: String,
      required: false,
    },
    /*duration: {
      type: Number,
      required: true,
      min: [1, "Duration must be at least 1 second"],
      validate: {
        validator: Number.isInteger,
        message: "Duration must be an integer",
      },
      },*/
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Albums",
      required: false,
    },
    image: {
      type: String,
    },
    genre: {
      type: [String], // Cambiado a array de strings
      required: false,
      default: [],
    },
    year: {
      type: Number,
      /*required: true,
      min: 1900,
      max: new Date().getFullYear() + 1,*/
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const SongModel = model("Songs", songSchema);
export default SongModel;
