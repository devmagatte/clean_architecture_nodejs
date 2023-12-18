import { Request, Response, NextFunction } from "express"

import ApiResponse from "../utils/ApiResponse"
import PrefixCodeSchema from "../constant/prefix_code_schema"
import { AuthHelper } from "../helpers/authHelper"

export interface DataToken {
  user_code: string
  user_type: string
}

export default class AuthMiddleware extends ApiResponse {
  constructor() {
    super("")
  }

  async authMiddlleware(
    req: Request,
    res: Response,
    next: NextFunction,
    prefixUser: string[],
  ) {
    try {
      const dataToken = await this.getDataToken(req)
      if (prefixUser.indexOf(dataToken.user_code.slice(0, 2)) >= 0) {
        return next()
      }
      return this.unauthorized(res)
    } catch (error: any) {
      return this.unauthorized(res)
    }
  }

  async getDataToken(req: Request): Promise<DataToken> {
    const matricule = await AuthHelper.getDataToken(req)
    return matricule
  }

  async authAdmin(req: Request, res: Response, next: NextFunction) {
    await this.authMiddlleware(req, res, next, [PrefixCodeSchema.admin])
  }

  async authClient(req: Request, res: Response, next: NextFunction) {
    await this.authMiddlleware(req, res, next, [PrefixCodeSchema.client])
  }

  async auth(req: Request, res: Response, next: NextFunction) {
    await this.authMiddlleware(req, res, next, [
      PrefixCodeSchema.admin,
      PrefixCodeSchema.client,
    ])
  }
}
