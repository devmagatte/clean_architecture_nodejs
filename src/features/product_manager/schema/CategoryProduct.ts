import mongoose, { Schema, model } from "mongoose"

export const COLLECTION_CATEGORY_PRODUCT_NAME = "category_products"

export interface ICategoryProduct {
  _id: mongoose.Types.ObjectId
  code: string
  slug: string
  name: string
  categorie_parent_code: string
}

export interface CategoryProductSchema extends ICategoryProduct, Document {}

const schema: Schema<CategoryProductSchema> = new Schema<CategoryProductSchema>(
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
    categorie_parent_code: {
      ref: COLLECTION_CATEGORY_PRODUCT_NAME,
      type: String,
    },
  },
  { timestamps: true },
)

export const CategoryProductEntity = model(
  COLLECTION_CATEGORY_PRODUCT_NAME,
  schema,
)
