import { UserSpecificField } from "../helpers/specific_field/UserSpecificField"
import { IUserDatasource } from "../datasources/UserDatasource"

import VerifyField from "../../../core/utils/VerifyField"
import IRepository from "../../../core/interfaces/InterfaceRepository"
import MatriculeGenerate from "../../../core/utils/MatriculeGenerate"
import UserTypeDatasource from "../datasources/UserTypeDatasource"
import CryptData from "../../../core/config/bcrypt"
import PrefixCodeSchema from "../../../core/constant/prefix_code_schema"

export interface IUserRepository extends IRepository {
  changeStatus(code: string): Promise<any>
}

export class UserRepository extends VerifyField implements IUserRepository {
  private matricule = new MatriculeGenerate()
  private bcrypt = new CryptData()
  private userTypeDatasource = new UserTypeDatasource()

  constructor(private datasource: IUserDatasource) {
    super()
  }

  async getAll(page: number, limit: number) {
    try {
      const result = await this.datasource.findAll(page, limit)

      if (result.data.length !== 0) {
        const list = result.data.map((value: object) =>
          UserSpecificField.fieldsWithJoin(value),
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
        return UserSpecificField.fields(result)
      }
      throw Error("code_not_found")
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async getOneByCode(code: string) {
    try {
      const result = await this.datasource.findOneByCode(code)
      if (this.isValid(result)) {
        return UserSpecificField.fieldsWithJoin(result)
      }
      throw Error("code_not_found")
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async save(body: any) {
    try {
      const data = UserSpecificField.fromBody(body)

      const match = { email: data.email }
      const isEmailIsUse = await this.datasource.isExiste(match)
      if (isEmailIsUse) throw Error("email_already_exists")

      await this.isUserTypeExiste(data)

      const code = this.matricule.generate(PrefixCodeSchema.admin)
      const password = this.bcrypt.hash(body.password)

      const bodyRequest = {
        ...data,
        code: code,
        password: password,
      }

      const result = await this.datasource.store(bodyRequest)
      return UserSpecificField.fields(result)
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async update(code: string, body: any) {
    try {
      const data = UserSpecificField.fromBody(body)

      const find = await this.datasource.filter({ email: data.email })
      const codeFind = find ? find.code : undefined
      if (codeFind != undefined && codeFind != code) {
        throw Error("email_already_exists")
      }

      await this.isUserTypeExiste(data)

      const result = await this.datasource.update(code, data)
      if (this.isValid(result)) {
        return UserSpecificField.fields(result)
      }

      throw Error("code_not_found")
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async isUserTypeExiste(body: any): Promise<void> {
    const { code_user_type } = body
    const isUseTypeExist = await this.userTypeDatasource.isExiste({
      code: code_user_type,
    })

    if (!isUseTypeExist) throw Error("code_not_found")
  }

  async changeStatus(code: string) {
    try {
      const data = await this.datasource.findOneByCode(code)
      if (this.isValid(data)) {
        const bodyRequest = { status: !data.status }
        await this.datasource.update(code, bodyRequest)
        data.status = !data.status
        return UserSpecificField.fields(data)
      }

      throw Error("code_not_found")
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async deleteOne(code: string) {
    try {
      const result = await this.datasource.deleteOne(code)

      if (result.deletedCount > 0) {
        return null
      }

      throw Error("code_not_found")
    } catch (error: any) {
      throw Error(error.message)
    }
  }
}
