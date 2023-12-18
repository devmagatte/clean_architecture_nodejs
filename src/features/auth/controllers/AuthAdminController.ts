import { Request, Response } from "express"

import ApiResponse from "../../../core/utils/ApiResponse"

import { AuthParamsVerify } from "../helpers/params_verify/AuthParamsVerify"
import { AuthFacade } from "../facade/AuthFacade"
import { AuthAdminRepository } from "../repositories/authAdminRepository"

export class AuthAdminController extends ApiResponse {
  private facade = new AuthFacade()
  private verifyParams = new AuthParamsVerify()

  constructor(private authRepository = new AuthAdminRepository()) {
    super("")
  }

  async signIn(req: Request, res: Response) {
    const { body } = req
    try {
      const MESSAGE_ERROR = this.verifyParams.verifyIdentifiant(body)
      if (MESSAGE_ERROR.length === 0) {
        const result = await this.authRepository.signIn(body)

        console.warn(`Admin connection with ${body.email}`)

        return this.created(res, 200, "Connexion avec succés", result)
      }
      console.error(`Admin connection with ${body.email}`)

      return this.clientError(res, MESSAGE_ERROR.toString())
    } catch (error: any) {
      console.error(`Admin connection ${error.message}: ${body.email}`)
      return this.sendError(error.message, res)
    }
  }

  signUp(req: Request, res: Response) {
    throw new Error("Method not implemented.")
  }

  async getProfil(req: Request, res: Response) {
    try {
      const auth = await this.facade.getProfil(req)
      if (auth) {
        return this.success(res, 200, "Connected user profile", auth)
      }
      return this.clientError(res, "Erreur Token")
    } catch (error: any) {
      return this.fail(res, error.message)
    }
  }

  async updateProfil(req: Request, res: Response) {
    try {
      const auth = await this.facade.getProfil(req)
      if (auth) {
        const { body } = req
        const MESSAGE_ERROR = this.verifyParams.verifyAllParamsUpdate(body)
        if (MESSAGE_ERROR.length === 0) {
          const result = await this.authRepository.updateProfil(auth.code, body)
          return this.success(res, 200, "Your profile has been updated", result)
        }
      }
      return this.unauthorized(res)
    } catch (error: any) {
      return this.fail(res, error.message)
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { body } = req
      const MESSAGE_ERROR = this.verifyParams.email(body)
      if (MESSAGE_ERROR === null) {
        const result =
          await this.authRepository.resetPasswordAndSendMailValidation(body)

        return this.success(
          res,
          200,
          "An email has been sent to you to update your password.",
          result,
        )
      }
      return this.clientError(res, MESSAGE_ERROR)
    } catch (error: any) {
      return this.fail(res, error.message)
    }
  }

  async verifyToken(req: Request, res: Response) {
    try {
      const { body } = req
      const MESSAGE_ERROR = this.verifyParams.token(body)
      if (MESSAGE_ERROR === null) {
        const result = await this.authRepository.verifyTokenValidation(body)

        return this.success(res, 200, "Token successfully verified", result)
      }
      return this.clientError(res, MESSAGE_ERROR)
    } catch (error: any) {
      return this.fail(res, error.message)
    }
  }

  async updatePassword(req: Request, res: Response) {
    try {
      const { body } = req
      const MESSAGE_ERROR = this.verifyParams.verifyParamsUpdatePassword(body)
      if (MESSAGE_ERROR.length === 0) {
        const result =
          await this.authRepository.updatePasswordIsValidToken(body)

        return this.success(res, 200, "Your password has been updated.", result)
      }
      return this.clientError(res, MESSAGE_ERROR.join(" - "))
    } catch (error: any) {
      return this.fail(res, error.message)
    }
  }
}
