import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import { IBand } from "../types/band.type";

const BandSchema = new Schema<IBand>(
  {
    // _id: mongoose.Types.ObjectId,
    bandname: { type: String, required: true },
    password: { type: String, required: true },
    genre: { type: [String], required: true },
    themes: { type: String, required: true },
    logoBand: {type: String},
    formedDate: { type: Date, required: true},
    // socialLinks: { type: [String], required: true}
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Bands = mongoose.model("band", BandSchema, 'band');
export default Bands;