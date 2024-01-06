import global from "../../../core/config/logger/global_winston"
import IDatasource from "../../../core/interfaces/InterfaceDatasource"
import OptionPagination from "../../../core/utils/OptionPagination"

import { StockEntity } from "../schema/Stock"

import { COLLECTION_PRODUCT_NAME } from "../schema/Product"
import { COLLECTION_CATEGORY_PRODUCT_NAME } from "../schema/CategoryProduct"

const LookUpProduct = {
  $lookup: {
    from: COLLECTION_PRODUCT_NAME,
    localField: "code_product",
    foreignField: "code",
    as: "product",
    pipeline: [
      {
        $lookup: {
          from: COLLECTION_CATEGORY_PRODUCT_NAME,
          localField: "code_product_type",
          foreignField: "code",
          as: "product_type",
        },
      },
      { $unwind: "$product_type" },
    ],
  },
}

export interface IStockDatasource extends IDatasource {}

export class StockDatasource implements IStockDatasource {
  constructor(private schema = StockEntity) {}

  async findAll(page: number, limit: number) {
    try {
      const FACET = OptionPagination.facetForMongoose(page, limit)
      const result = await this.schema
        .aggregate([LookUpProduct, { $unwind: "$product" }, FACET])
        .exec()

      return result[0]
    } catch (error: any) {
      global.logger.error(error)
      throw error.message
    }
  }

  async filter(match: object) {
    try {
      const result = await this.schema
        .aggregate([LookUpProduct, { $unwind: "$product" }, { $match: match }])
        .exec()
      return result[0]
    } catch (error: any) {
      throw error.message
    }
  }

  async findOneByCode(code: string) {
    try {
      const result = await this.schema
        .aggregate([
          LookUpProduct,
          { $unwind: "$product" },
          { $match: { code: code } },
        ])
        .exec()

      return result[0]
    } catch (error: any) {
      throw error.message
    }
  }

  async findOne(match: object) {
    try {
      const result = await this.schema
        .aggregate([LookUpProduct, { $unwind: "$product" }, { $match: match }])
        .exec()
      return result[0]
    } catch (error: any) {
      throw error.message
    }
  }

  async store(body: object) {
    try {
      return await this.schema.create(body)
    } catch (error: any) {
      throw error.message
    }
  }

  async update(code: string, body: any) {
    const filter = { code: code }
    const option = { new: true }
    try {
      return await this.schema.findOneAndUpdate(filter, body, option).exec()
    } catch (error: any) {
      throw new error.message()
    }
  }

  async isExiste(match: object): Promise<boolean> {
    const result = await this.schema.findOne(match).exec()
    return result !== null
  }

  async deleteOne(code: string) {
    try {
      return await this.schema.deleteOne({ code: code }).exec()
    } catch (error: any) {
      throw error.message
    }
  }
}
