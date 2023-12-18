import { Request } from "express"

import { AuthHelper } from "../../../core/helpers/authHelper"
import { UserDatasource } from "../../user/datasources/UserDatasource"
import { UserRepository } from "../../user/repositories/UserRepository"

export class AuthFacade {
  private userRepository = new UserRepository(new UserDatasource())

  async getProfil(req: Request) {
    try {
      const dataToken = await AuthHelper.getDataToken(req)

      if (dataToken) {
        return await this.userRepository.getOneByCode(dataToken.user_code)
      }
      throw Error("Unauthorized access")
    } catch (error: any) {
      throw Error(error.message ?? error)
    }
  }
}
