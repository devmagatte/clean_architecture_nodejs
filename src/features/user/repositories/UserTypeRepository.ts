import UserTypeSpecificField from "../helpers/specific_field/UserTypeSpecificField"
import UserTypeDatasource from "../datasources/UserTypeDatasource"

import VerifyField from "../../../core/utils/VerifyField"
import IRepository from "../../../core/interfaces/InterfaceRepository"
import MatriculeGenerate from "../../../core/utils/MatriculeGenerate"
import SlugGen from "../../../core/utils/SlugGen"

export interface IUserTypeRepository extends IRepository {}

export default class AdminRepository
  extends VerifyField
  implements IUserTypeRepository
{
  private matricule = new MatriculeGenerate()
  private slug = new SlugGen()

  constructor(private datasource: UserTypeDatasource) {
    super()
  }

  async getAll(page: number, limit: number) {
    try {
      const result = await this.datasource.findAll(page, limit)

      if (result.data.length !== 0) {
        const list = result.data.map((value: object) =>
          UserTypeSpecificField.fields(value),
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
        return UserTypeSpecificField.fields(result)
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
        return UserTypeSpecificField.fields(result)
      }
      throw Error("code_not_found")
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async save(body: any) {
    try {
      const data = UserTypeSpecificField.fromBody(body)
      const code = this.matricule.generate()
      const slug = this.slug.generate(data.name)

      const match = {
        slug: slug,
      }

      const isExiste = await this.datasource.isExiste(match)
      if (isExiste) throw Error("name_already_exists")

      const bodyRequest = {
        ...data,
        code: code,
        slug: slug,
      }

      const result = await this.datasource.store(bodyRequest)
      return UserTypeSpecificField.fields(result)
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async update(code: string, body: object) {
    try {
      const data = UserTypeSpecificField.fromBody(body)

      const find = await this.datasource.filter({ name: data.name })
      const codeFind = find ? find.code : undefined
      if (codeFind != undefined && codeFind != code) {
        throw Error("name_already_exists")
      }

      const slug = this.slug.generate(data.name)

      const bodyRequest = {
        ...data,
        code: code,
        slug: slug,
      }

      const result = await this.datasource.update(code, bodyRequest)
      if (this.isValid(result)) {
        return UserTypeSpecificField.fields(result)
      }

      throw Error("code_not_found")
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  deleteOne(code: string) {
    throw new Error("Method not implemented.")
  }
}
