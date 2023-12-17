import IDatasource from "../../../core/interfaces/InterfaceDatasource"
import OptionPagination from "../../../core/utils/OptionPagination"
import { UserTypeEntity } from "../schema/UserType"

export interface IUserTypeDatasource extends IDatasource {
  findOne(match: object): any
}

export default class UserTypeDatasource implements IUserTypeDatasource {
  constructor(private schema = UserTypeEntity) {}

  async findAll(page: number, limit: number) {
    try {
      const FACET = OptionPagination.facetForMongoose(page, limit)
      const result = await this.schema.aggregate([FACET]).exec()

      return result[0]
    } catch (error: any) {
      throw error.message
    }
  }

  async filter(match: object) {
    try {
      const result = await this.schema.aggregate([{ $match: match }]).exec()
      return result[0]
    } catch (error: any) {
      throw error.message
    }
  }

  async findOneByCode(code: string) {
    try {
      const result = await this.schema
        .aggregate([{ $match: { code: code } }])
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

  async findOne(match: object) {
    try {
      const result = await this.schema.aggregate([{ $match: match }]).exec()
      return result[0]
    } catch (error: any) {
      throw error.message
    }
  }

  deleteOne(code: string) {
    throw new Error("Method not implemented.")
  }
}
