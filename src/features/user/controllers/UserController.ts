import { Request, Response } from "express"
import IController from "../../../core/interfaces/InterfaceController"
import ApiResponse from "../../../core/utils/ApiResponse"
import OptionPagination from "../../../core/utils/OptionPagination"

import { UserParamsVerify } from "../helpers/params_verify/UserParamsVerify"
import { IUserRepository } from "../repositories/UserRepository"

interface IUserController extends IController {
  status(req: Request, res: Response): any
}

export class UserController extends ApiResponse implements IUserController {
  private verifyParams = new UserParamsVerify()
  constructor(private repository: IUserRepository) {
    super("")
  }
  async index(req: Request, res: Response) {
    try {
      const pagination = new OptionPagination(req)
      const result = await this.repository.getAll(
        pagination.page,
        pagination.limit,
      )
      return this.success(res, 200, "Liste des types d'utilisateurs", result)
    } catch (error: any) {
      return this.fail(res, error.message)
    }
  }

  async store(req: Request, res: Response) {
    const { body } = req
    try {
      const MESSAGE_ERROR = this.verifyParams.verifyAllParamsStore(body)

      if (MESSAGE_ERROR.length === 0) {
        const result = await this.repository.save(body)
        return this.created(res, 201, "Utilisateur crée", result)
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
      return this.success(res, 200, "Type d'utilisateur", result)
    } catch (error: any) {
      return this.sendError(error.message, res)
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { params } = req
      const { body } = req

      const MESSAGE_ERROR = this.verifyParams.verifyAllParamsUpdate(body)

      if (MESSAGE_ERROR === null) {
        const result = await this.repository.update(params.code, body)
        return this.created(
          res,
          200,
          "Le type d'utilisateur a étè mise à jour",
          result,
        )
      }
      return this.clientError(res, MESSAGE_ERROR.join(" - "))
    } catch (error: any) {
      return this.sendError(error.message, res)
    }
  }

  async status(req: Request, res: Response) {
    try {
      const { params } = req
      const result = await this.repository.changeStatus(params.code)
      return this.created(res, 200, "Status customer has been updated", result)
    } catch (error: any) {
      return this.sendError(error.message, res)
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { params } = req
      const { code } = params

      await this.repository.deleteOne(code)
      return this.success(
        res,
        200,
        "Le type d'utilisateur a étè supprimé",
        null,
      )
    } catch (error: any) {
      return this.sendError(error.message, res)
    }
  }
}
