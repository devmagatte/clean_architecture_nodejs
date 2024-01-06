import OptionPagination from "../../../core/utils/OptionPagination"
import { MediasEntity } from "../schema/medias"

export default class MediaDatasource {
  constructor(private schema = MediasEntity) {}

  async findAll(page: number, limit: number) {
    const FACET = OptionPagination.facetForMongoose(page, limit)
    try {
      const result = await this.schema.aggregate([FACET])
      return result[0]
    } catch (error: any) {
      throw error.message
    }
  }

  async store(body: any) {
    try {
      return await this.schema.create(body)
    } catch (error: any) {
      throw error.message
    }
  }

  //   async saveMany(arrayObjet) {
  // try {
  //   return await this.schema.create(arrayObjet)
  // } catch (error) {
  //   throw Error(error)
  // }
  // throw new Error("Method not implemented.")
  //   }

  async deleteOne(code: string) {
    try {
      const match = { code: code }
      return await this.schema.deleteOne(match)
    } catch (error: any) {
      throw error.message
    }
  }
}
