import IDatasource from "../../../core/interfaces/InterfaceDatasource"
import OptionPagination from "../../../core/utils/OptionPagination"
import {
  COLLECTION_CATEGORY_PRODUCT_NAME,
  CategoryProductEntity,
} from "../schema/CategoryProduct"

const LookUpCategoryProduct = {
  $lookup: {
    from: COLLECTION_CATEGORY_PRODUCT_NAME,
    localField: "code",
    foreignField: "categorie_parent_code",
    as: "categorie",
  },
}

const pipelineHelper = (params: any) => [
  {
    $match: { categorieParente: null }, // Pour récupérer les catégories racines
  },
  LookUpCategoryProduct,
  params,
]

export interface ICategoryProductDatasource extends IDatasource {}

export class CategoryProductDatasource implements ICategoryProductDatasource {
  constructor(private schema = CategoryProductEntity) {}

  async findAll(page: number, limit: number) {
    try {
      const FACET = OptionPagination.facetForMongoose(page, limit)
      const pipeline = pipelineHelper(FACET)

      const result = await this.schema.aggregate(pipeline).exec()

      return result[0]
    } catch (error: any) {
      throw error.message
    }
  }

  async filter(match: object) {
    try {
      const pipeline = pipelineHelper({ $match: match })
      const result = await this.schema.aggregate(pipeline).exec()
      return result[0]
    } catch (error: any) {
      throw error.message
    }
  }

  async findOneByCode(code: string) {
    try {
      const match = { $match: { code: code } }
      const pipeline = pipelineHelper(match)

      const result = await this.schema.aggregate(pipeline).exec()
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
