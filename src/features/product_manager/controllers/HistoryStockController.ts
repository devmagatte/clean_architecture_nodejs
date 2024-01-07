import { Request, Response } from "express"
import IController from "../../../core/interfaces/InterfaceController"
import ApiResponse from "../../../core/utils/ApiResponse"
import OptionPagination from "../../../core/utils/OptionPagination"

import { HistoryStockRepository } from "../repositories/HistoryStockRepository"

export interface IHistoryStockController extends IController {}

export class HistoryStockController
  extends ApiResponse
  implements IHistoryStockController
{
  constructor(private repository: HistoryStockRepository) {
    super("")
  }

  async index(req: Request, res: Response) {
    try {
      const pagination = new OptionPagination(req)
      const result = await this.repository.getAll(
        pagination.page,
        pagination.limit,
      )
      return this.success(res, 200, "Liste de l'historique", result)
    } catch (error: any) {
      return this.fail(res, error.message)
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { params } = req
      const { code } = params

      const result = await this.repository.getOneByCode(code)
      return this.success(res, 200, "Details historique", result)
    } catch (error: any) {
      return this.sendError(error.message, res)
    }
  }

  async store(req: Request, res: Response) {
    throw new Error(`Method not implemented. ${req} - ${res}`)
  }

  async update(req: Request, res: Response) {
    throw new Error(`Method not implemented. ${req} - ${res}`)
  }

  async delete(req: Request, res: Response) {
    throw new Error(`Method not implemented. ${req} - ${res}`)
  }
}
