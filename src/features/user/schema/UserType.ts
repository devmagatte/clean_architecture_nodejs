import mongoose, { Schema, model } from "mongoose"

export const COLLECTION_TYPE_USER_NAME = "user_types"

export interface IUserType {
  _id: mongoose.Types.ObjectId
  code: string
  slug: string
  name: string
}

export interface UserTypeSchema extends IUserType, Document {}

const schema: Schema<UserTypeSchema> = new Schema<UserTypeSchema>(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
)

export const UserTypeEntity = model(COLLECTION_TYPE_USER_NAME, schema)
