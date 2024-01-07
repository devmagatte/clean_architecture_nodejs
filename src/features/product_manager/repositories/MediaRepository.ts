import MatriculeGenerate from "../../../core/utils/MatriculeGenerate"
import { MediasDatasource } from "../datasources/MediaDatatsource"
import MediaSpecificField from "../helpers/specific_field/MediaSpecificField"

export class MediasRepository {
  constructor(private datasource = new MediasDatasource()) {}

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

  async save(urls: string[]) {
    try {
      const bodyRequest: { code: string; url: string }[] = []
      for (const url of urls) {
        const matricule = new MatriculeGenerate()
        let values = {
          code: matricule.generate(),
          url: url,
        }
        bodyRequest.push(values)
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
