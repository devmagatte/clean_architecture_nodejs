import mongoose, { Schema, model } from "mongoose"
import { ActionHistory } from "../../../core/constant/ActionHistory"

export const COLLECTION_HISTORY_STOCK_NAME = "history_stocks"

export interface IHistoryStock {
  _id: mongoose.Types.ObjectId
  action: string
  quantity: number
  code_product: string
  code_user: string
}

export interface HistoryStockSchema extends IHistoryStock, Document {}

const schema: Schema<HistoryStockSchema> = new Schema<HistoryStockSchema>(
  {
    action: {
      type: String,
      required: true,
      enum: ActionHistory.values,
    },
    quantity: {
      type: Number,
      required: true,
    },
    code_product: {
      type: String,
      required: true,
    },
    code_user: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

export const HistoryStockEntity = model(COLLECTION_HISTORY_STOCK_NAME, schema)
