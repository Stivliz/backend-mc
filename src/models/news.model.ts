import mongoose, { Schema, Document } from "mongoose";

export interface INews extends Document {
  title: string;
  description: string;
  link: string;
  img: string;
  createdAt: Date;
}

const NewsSchema = new Schema<INews>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  img: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const News = mongoose.model<INews>("News", NewsSchema);