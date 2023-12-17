import mongoose, { Schema, model } from "mongoose"
import { COLLECTION_TYPE_USER_NAME } from "./UserType"

export const COLLECTION_USER_NAME = "users"

export interface IUser {
  _id: mongoose.Types.ObjectId
  code: string
  first_name: string
  last_name: string
  email: string
  address: string
  password: string
  status: boolean
  token: string
  token_identify: string
  token_expire_at: Date
  code_user_type: string
}

export type UserSchema = object & IUser & Document

const schema: Schema<UserSchema> = new Schema<UserSchema>(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: false,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    token: {
      type: String,
      default: null,
    },
    token_identify: {
      type: String,
      default: null,
    },
    token_expire_at: {
      type: Date,
      default: null,
    },
    code_user_type: {
      ref: COLLECTION_TYPE_USER_NAME,
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export const UserEntity = model(COLLECTION_USER_NAME, schema)
