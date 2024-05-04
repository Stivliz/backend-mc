import { Schema, model } from "mongoose";
import mongoose from "mongoose";

interface IBand {
  _id: mongoose.Types.ObjectId;
  bandname: string;
  genre?: string;
  country?: string;
  themes: string;
  logoBand?: Buffer;
//   status?: object[];
  formedDate: Date;
}

const BandSchema = new Schema<IBand>(
  {
    bandname: { type: String, required: true },
    genre: { type: String, required: true },
    themes: { type: String, required: true },
    logoBand: {type: Buffer, required: true},
    formedDate: { type: Date, required: true}
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Band", BandSchema);