import mongoose from "mongoose";

//Intesfaces que se utilizaran en el los modelos para tipar los schemas.
export default interface ISong {
  BandId: mongoose.Types.ObjectId;
  name: string;
  artist?: string;
  //duration: number;
  album?: string;
  image?: string | undefined;
  genre?: string[];
  year?: number;
}

export default interface IAlbum {
  BandId: mongoose.Types.ObjectId;
  name: string;
  artist?: string;
  songs: {
    songId: mongoose.Types.ObjectId;
    name: string;
  }[];
  image?: string;
  releaseType: string;
  genre?: string[];
  year?: number;
}
