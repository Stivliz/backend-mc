import mongoose from "mongoose";

export interface IBand {
  _id: mongoose.Types.ObjectId;
  bandname: string;
  password: string;
  genre: string[];
  country?: string;
  // themes?: string;
  logoBand?: string;
  //   status?: object[];
  formedDate?: Date;
  socialLinks?: string[];
  albums: mongoose.Types.ObjectId;
  description?: string;
}
