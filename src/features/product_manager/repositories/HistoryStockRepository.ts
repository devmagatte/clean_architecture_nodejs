import { HistoryStockSpecificField } from "../helpers/specific_field/HistoryStockSpecificField"
import { HistoryStockDatasource } from "../datasources/HistoryStockDatasource"

import VerifyField from "../../../core/utils/VerifyField"
import IRepository from "../../../core/interfaces/InterfaceRepository"

export interface IHistoryStockRepository extends IRepository {}

export class HistoryStockRepository
  extends VerifyField
  implements IHistoryStockRepository
{
  constructor(private datasource: HistoryStockDatasource) {
    super()
  }

  async getAll(page: number, limit: number) {
    try {
      const result = await this.datasource.findAll(page, limit)

      if (result.data.length !== 0) {
        const list = result.data.map((value: object) =>
          HistoryStockSpecificField.fields(value),
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

  async getOneByCode(code: string) {
    try {
      const result = await this.datasource.findOneByCode(code)
      if (this.isValid(result)) {
        return HistoryStockSpecificField.fields(result)
      }
      throw Error("Le code est introuvable")
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  getOne(match: object) {
    throw new Error(`Method not implemented. ${match}`)
  }

  update(code: string, body: any) {
    throw new Error(`Method not implemented. ${code} ${body}`)
  }

  deleteOne(code: string) {
    throw new Error(`Method not implemented. ${code}`)
  }

  async save(body: any) {
    throw new Error(`Method not implemented. ${body}`)
  }
}
