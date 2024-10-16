import SongModel from "../models/song.model";
import ISong from "../interfaces/interfaces";
import mongoose from "mongoose";
import { createCaseInsensitiveRegex } from "../utils/helpers/createCaseInsensitiveRegex";

export const insertSong = async (songData: ISong, SubId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const song = new SongModel({
      ...songData,
      BandId: SubId, // Id de la banda
    });

    const savedSong = await song.save({ session });
    await session.commitTransaction();
    session.endSession();
    return savedSong;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const findSongId = async (id: string) => {
  const searchResponseId = await SongModel.findOne({ _id: id });
  return searchResponseId;
};

export const findSongs = async (name: string) => {
  if (!name) {
    const searchResponceAll = await SongModel.find({});
    return searchResponceAll;
  }

  const searchResponseName = await SongModel.findOne({
    name: createCaseInsensitiveRegex(name),
  });
  return searchResponseName;
};

export const updateSong = async (id: string, body: ISong) => {
  const searchSongAndUpdate = await SongModel.findOneAndUpdate(
    { _id: id },
    body,
    { new: true },
  );
  return searchSongAndUpdate;
};

export const deleteSong = async (id: string) => {
  const searchSongAndDeleted = SongModel.findByIdAndDelete({ _id: id });
  return searchSongAndDeleted;
};
