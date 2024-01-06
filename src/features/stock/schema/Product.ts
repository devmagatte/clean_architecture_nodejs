import mongoose, { Schema, model } from "mongoose"

import { COLLECTION_CATEGORY_PRODUCT_NAME } from "./CategoryProduct"
import TypeProduct from "../../../core/constant/type_product"
import { StatusProduct } from "../../../core/constant/statusProduct"

export const COLLECTION_PRODUCT_NAME = "products"

export interface IProduct {
  _id: mongoose.Types.ObjectId
  code: string
  slug: string
  name: string
  description: string
  price: number
  price_variation: Map<string, any>[]
  type: string
  status: string
  category_code: string
}

export interface ProductSchema extends IProduct, Document {}

const schema: Schema<ProductSchema> = new Schema<ProductSchema>(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      required: true,
      enum: TypeProduct.values,
    },
    status: {
      type: String,
      default: StatusProduct.publish,
      enum: StatusProduct.values,
    },
    price: {
      type: Number,
      required: true,
    },
    price_variation: {
      type: [Map<string, any>],
      required: false,
      default: null,
    },
    category_code: {
      ref: COLLECTION_CATEGORY_PRODUCT_NAME,
      type: String,
      default: "unknow",
    },
  },
  { timestamps: true },
)

export const ProductEntity = model(COLLECTION_PRODUCT_NAME, schema)
