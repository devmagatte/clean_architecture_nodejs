import IDatasource from "../../../core/interfaces/InterfaceDatasource"
import OptionPagination from "../../../core/utils/OptionPagination"

import { ProductEntity } from "../schema/Product"
import { COLLECTION_CATEGORY_PRODUCT_NAME } from "../schema/CategoryProduct"

const LookUpProductType = {
  $lookup: {
    from: COLLECTION_CATEGORY_PRODUCT_NAME,
    localField: "category_code",
    foreignField: "code",
    as: "category",
  },
}

export interface IProductDatasource extends IDatasource {}

export class ProductDatasource implements IProductDatasource {
  constructor(private schema = ProductEntity) {}

  async findAll(page: number, limit: number) {
    try {
      const FACET = OptionPagination.facetForMongoose(page, limit)
      const result = await this.schema
        .aggregate([LookUpProductType, { $unwind: "$category" }, FACET])
        .exec()

      return result[0]
    } catch (error: any) {
      throw error.message
    }
  }

  async filter(match: object) {
    try {
      const result = await this.schema
        .aggregate([
          LookUpProductType,
          { $unwind: "$category" },
          { $match: match },
        ])
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
          LookUpProductType,
          { $unwind: "$category" },
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

  async update(code: string, body: object) {
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
