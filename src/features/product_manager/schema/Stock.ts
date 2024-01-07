import mongoose, { Schema, model } from "mongoose"

export const COLLECTION_STOCK_NAME = "stocks"

export interface IStock {
  _id: mongoose.Types.ObjectId
  code: string
  stock_level: number
  code_product: string
}

export interface StockSchema extends IStock, Document {}

const schema: Schema<StockSchema> = new Schema<StockSchema>(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    stock_level: {
      type: Number,
      required: true,
    },
    code_product: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
)

export const StockEntity = model(COLLECTION_STOCK_NAME, schema)
