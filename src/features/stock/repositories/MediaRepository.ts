import MatriculeGenerate from "../../../core/utils/MatriculeGenerate.js"
import MediaDatasource from "../datasources/MediaDatatsource.js"
import MediaSpecificField from "../helpers/specific_field/MediaSpecificField.js"

export default class MediasRepository {
  constructor(private datasource = new MediaDatasource()) {}

  async getAll(page: number, limit: number) {
    try {
      const result = await this.datasource.findAll(page, limit)
      if (result.data.length !== 0) {
        const list = result.data.map((value: object) =>
          MediaSpecificField.fields(value),
        )
        return {
          pagination: {
            total: result.metadata[0].total,
            page: result.metadata[0].page,
          },
          list,
        }
      }
      return []
    } catch (error: any) {
      throw Error(error)
    }
  }

  async save(url: string) {
    try {
      const matricule = new MatriculeGenerate()
      const bodyRequest = {
        code: matricule,
        url: url,
      }
      await this.datasource.store(bodyRequest)
      return null
    } catch (error: any) {
      throw Error(error)
    }
  }

  async delete(code: string) {
    try {
      await this.datasource.deleteOne(code)
      return null
    } catch (error: any) {
      throw Error(error)
    }
  }
}
