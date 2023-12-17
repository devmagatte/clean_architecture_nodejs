import IDatasource from "../../../core/interfaces/InterfaceDatasource"
import OptionPagination from "../../../core/utils/OptionPagination"
import { UserEntity } from "../schema/User"
import { COLLECTION_TYPE_USER_NAME } from "../schema/UserType"

const LookUpUserType = {
  $lookup: {
    from: COLLECTION_TYPE_USER_NAME,
    localField: "code_user_type",
    foreignField: "code",
    as: "user_type",
  },
}

const pipelineHelper = (params: any) => [
  LookUpUserType,
  { $unwind: "$user_type" },
  params,
]

export interface IUserDatasource extends IDatasource {
  findOne(match: object): any
}

export class UserDatasource implements IUserDatasource {
  constructor(private schema = UserEntity) {}

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
      const result = await this.schema.aggregate([{ $match: match }]).exec()
      return result
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

  async findOne(match: object) {
    try {
      const MATCH = { $match: match }
      const pipeline = pipelineHelper(MATCH)

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
