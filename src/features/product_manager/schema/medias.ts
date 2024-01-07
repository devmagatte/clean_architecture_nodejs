import mongoose, { Schema, model } from "mongoose"

export const COLLECTION_MEDIA = "medias"

export interface IMedia {
  _id: mongoose.Types.ObjectId
  code: string
  url: string
}

export interface MediaSchema extends IMedia, Document {}

const schema: Schema<MediaSchema> = new Schema<MediaSchema>(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    url: {
      type: String,
      require: true,
    },
  },
  { timestamps: true },
)

export const MediasEntity = model(COLLECTION_MEDIA, schema)
