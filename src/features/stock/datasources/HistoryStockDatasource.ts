import global from "../../../core/config/logger/global_winston"
import IDatasource from "../../../core/interfaces/InterfaceDatasource"
import OptionPagination from "../../../core/utils/OptionPagination"

import { HistoryStockEntity } from "../schema/HistoryStock"

import { COLLECTION_USER_NAME } from "../../user/schema/User"
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

const LookUpUser = {
  $lookup: {
    from: COLLECTION_USER_NAME,
    localField: "code_user",
    foreignField: "code",
    as: "user",
  },
}

export interface IHistoryStockDatasource extends IDatasource {}

export class HistoryStockDatasource implements IHistoryStockDatasource {
  constructor(private schema = HistoryStockEntity) {}

  async findAll(page: number, limit: number) {
    try {
      const FACET = OptionPagination.facetForMongoose(page, limit)
      const result = await this.schema
        .aggregate([
          LookUpUser,
          { $unwind: "$user" },
          LookUpProduct,
          { $unwind: "$product" },
          FACET,
        ])
        .exec()

      return result[0]
    } catch (error: any) {
      global.logger.error(error)
      throw error.message
    }
  }

  async findOneByCode(code: string) {
    try {
      const result = await this.schema
        .aggregate([
          LookUpUser,
          { $unwind: "$user" },
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

  async store(body: object) {
    try {
      return await this.schema.create(body)
    } catch (error: any) {
      throw error.message
    }
  }

  async filter(match: object) {
    throw new Error(`Method not implemented. ${match}`)
  }

  deleteOne(code: string) {
    throw new Error(`Method not implemented. ${code}`)
  }

  isExiste(match: object): Promise<boolean> {
    throw new Error(`Method not implemented. ${match}`)
  }

  async update(code: string, body: object) {
    throw new Error(`Method not implemented. ${code} ${body}`)
  }
}
