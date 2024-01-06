import { Request, Response } from "express"
import IController from "../../../core/interfaces/InterfaceController"
import ApiResponse from "../../../core/utils/ApiResponse"
import OptionPagination from "../../../core/utils/OptionPagination"

import { StockParamsVerify } from "../helpers/params_verify/StockParamsVerify"
import { StockRepository } from "../repositories/StockRepository"
import { AuthFacade } from "../../auth/facade/AuthFacade"

export interface IStockController extends IController {}

export class StockController extends ApiResponse implements IStockController {
  private verifyParams = new StockParamsVerify()
  constructor(private repository: StockRepository) {
    super("")
  }

  async index(req: Request, res: Response) {
    try {
      const pagination = new OptionPagination(req)
      const result = await this.repository.getAll(
        pagination.page,
        pagination.limit,
      )
      return this.success(res, 200, "Liste des produit en stock", result)
    } catch (error: any) {
      return this.fail(res, error.message)
    }
  }

  async store(req: Request, res: Response) {
    const { body } = req
    try {
      const MESSAGE_ERROR = this.verifyParams.verifyAllParamsStore(body)

      if (MESSAGE_ERROR.length === 0) {
        const user = await new AuthFacade().getProfilAdminWithToken(req)
        body.code_user = user.code
        const result = await this.repository.save(body)
        return this.created(res, 201, "Création réussie", result)
      }

      return this.clientError(res, MESSAGE_ERROR.join(" - "))
    } catch (error: unknown) {
      return this.sendError(error, res)
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { params } = req
      const { code } = params

      const result = await this.repository.getOneByCode(code)
      return this.success(res, 200, "Details", result)
    } catch (error: any) {
      return this.sendError(error.message, res)
    }
  }

  async update(req: Request, res: Response) {
    throw new Error(`Method not implemented. ${req} - ${res}`)
  }

  async delete(req: Request, res: Response) {
    try {
      const { params } = req
      const { code } = params

      await this.repository.deleteOne(code)
      return this.success(res, 200, "Suppression réussie", null)
    } catch (error: any) {
      return this.sendError(error.message, res)
    }
  }
}
