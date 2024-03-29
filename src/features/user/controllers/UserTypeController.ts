import { Request, Response } from "express"
import IController from "../../../core/interfaces/InterfaceController"
import ApiResponse from "../../../core/utils/ApiResponse"
import OptionPagination from "../../../core/utils/OptionPagination"

import UserParamsVerify from "../helpers/params_verify/UserTypeParamsVerify"
import UserTypeRepository from "../repositories/UserTypeRepository"
import translateText from "../../../core/helpers/i18nHelper"

interface IUserTypeController extends IController {}

export default class AdminController
  extends ApiResponse
  implements IUserTypeController
{
  private verifyParams = new UserParamsVerify()
  constructor(private repository: UserTypeRepository) {
    super("")
  }

  async index(req: Request, res: Response) {
    try {
      const pagination = new OptionPagination(req)
      const result = await this.repository.getAll(
        pagination.page,
        pagination.limit,
      )
      return this.success(
        res,
        200,
        translateText("list_type_user", req),
        result,
      )
    } catch (error: any) {
      return this.sendError(translateText(error.message, req), res)
    }
  }

  async store(req: Request, res: Response) {
    const { body } = req
    try {
      const MESSAGE_ERROR = this.verifyParams.name(body)

      if (MESSAGE_ERROR === null) {
        const result = await this.repository.save(body)
        return this.created(
          res,
          201,
          translateText("store_type_user", req),
          result,
        )
      }

      return this.clientError(res, MESSAGE_ERROR)
    } catch (error: any) {
      return this.sendError(translateText(error.message, req), res)
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { params } = req
      const { code } = params

      const result = await this.repository.getOneByCode(code)
      return this.success(
        res,
        200,
        translateText("show_type_user", req),
        result,
      )
    } catch (error: any) {
      return this.sendError(translateText(error.message, req), res)
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { params } = req
      const { body } = req

      const MESSAGE_ERROR = this.verifyParams.name(body)

      if (MESSAGE_ERROR === null) {
        const result = await this.repository.update(params.code, body)
        return this.created(
          res,
          200,
          translateText("update_type_user", req),
          result,
        )
      }
      return this.clientError(res, MESSAGE_ERROR)
    } catch (error: any) {
      return this.sendError(error.message, res)
    }
  }

  async delete(req: Request, res: Response) {
    throw new Error("Method not implemented.")
  }
}
