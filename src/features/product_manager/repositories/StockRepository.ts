import { StockSpecificField } from "../helpers/specific_field/StockSpecificField"
import { StockDatasource } from "../datasources/StockDatasource"

import VerifyField from "../../../core/utils/VerifyField"
import IRepository from "../../../core/interfaces/InterfaceRepository"
import MatriculeGenerate from "../../../core/utils/MatriculeGenerate"
import { ProductDatasource } from "../datasources/ProductDatasource"
import { ActionHistory } from "../../../core/constant/ActionHistory"
import { HistoryStockDatasource } from "../datasources/HistoryStockDatasource"

export interface IStockRepository extends IRepository {}

export class StockRepository extends VerifyField implements IStockRepository {
  private matricule = new MatriculeGenerate()
  private productDatasource = new ProductDatasource()

  constructor(private datasource: StockDatasource) {
    super()
  }

  async getAll(page: number, limit: number) {
    try {
      const result = await this.datasource.findAll(page, limit)

      if (result.data.length !== 0) {
        const list = result.data.map((value: object) =>
          StockSpecificField.fieldsWithJoin(value),
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

  async getOne(match: object) {
    try {
      const result = await this.datasource.filter(match)
      if (this.isValid(result)) {
        return StockSpecificField.fieldsWithJoin(result)
      }
      throw Error("Le code est introuvable")
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async getOneByCode(code: string) {
    try {
      const result = await this.datasource.findOneByCode(code)
      if (this.isValid(result)) {
        return StockSpecificField.fieldsWithJoin(result)
      }
      throw Error("Le code est introuvable")
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async save(body: any) {
    try {
      const data = StockSpecificField.fromBody(body)

      const isProductExiste = await this.productDatasource.isExiste({
        code: data.code_product,
      })
      if (!isProductExiste) throw Error("Le code du produit est introuvable")

      const match = {
        code_product: data.code_product,
      }

      const bodyRequest = {
        ...data,
      }

      const stock = await this.datasource.findOne(match)

      if (stock) {
        bodyRequest.stock_level = this.caculateStockLevelByAction(
          body.action,
          stock,
          data,
        )
        const result = await this.datasource.update(stock.code, bodyRequest)
        const historyStockDatasource = new HistoryStockDatasource()
        await historyStockDatasource.store({
          action: body.action,
          quantity: body.number,
          code_product: data.code_product,
          code_user: body.code_user,
        })

        return StockSpecificField.fields(result)
      } else {
        const code = this.matricule.generate()
        const bodyRequest = {
          ...data,
          code,
        }
        const result = await this.datasource.store(bodyRequest)
        return StockSpecificField.fields(result)
      }
    } catch (error: any) {
      throw Error(error.message ?? "Erreur durant la création")
    }
  }

  caculateStockLevelByAction(action: string, value: any, data: any): number {
    switch (action) {
      case ActionHistory.entree:
        return (data.stock_level += value.stock_level)
      case ActionHistory.retour:
        return (data.stock_level += value.stock_level)
      case ActionHistory.sotie:
        return (data.stock_level = value.stock_level - data.stock_level)
      default:
        return data.stock_level
    }
  }

  update(code: string, body: any) {
    throw new Error(`Method not implemented. ${code} - ${body}`)
  }

  async deleteOne(code: string) {
    try {
      const result = await this.datasource.deleteOne(code)

      if (result.deletedCount > 0) {
        return StockSpecificField.fields(result)
      }

      throw Error("Le code est introuvable")
    } catch (error: any) {
      throw Error(error.message)
    }
  }
}
