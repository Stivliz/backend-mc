import mongoose from "mongoose";

//Intesfaces que se utilizaran en el los modelos para tipar los schemas.
export default interface ISong {
  name: string;
  artist?: string;
  album?: string;
  image?: string;
  genre?: string[];
  year?: number;
}

export default interface IAlbum {
  BandId: mongoose.Types.ObjectId;
  name: string;
  artist?: string;
  songs: string[];
  image?: string;
  genre?: string[];
  year?: number;
}
