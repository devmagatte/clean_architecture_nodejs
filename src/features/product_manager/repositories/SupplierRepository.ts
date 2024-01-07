import { SupplierSpecificField } from "../helpers/specific_field/SupplierSpecificField"
import { SupplierDatasource } from "../datasources/SupplierDatasource"

import VerifyField from "../../../core/utils/VerifyField"
import IRepository from "../../../core/interfaces/InterfaceRepository"
import MatriculeGenerate from "../../../core/utils/MatriculeGenerate"

export interface ISupplierRepository extends IRepository {}

export class SupplierRepository
  extends VerifyField
  implements ISupplierRepository
{
  private matricule = new MatriculeGenerate()

  constructor(private datasource: SupplierDatasource) {
    super()
  }

  async getAll(page: number, limit: number) {
    try {
      const result = await this.datasource.findAll(page, limit)

      if (result.data.length !== 0) {
        const list = result.data.map((value: object) =>
          SupplierSpecificField.fields(value),
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
        return SupplierSpecificField.fields(result)
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
        return SupplierSpecificField.fields(result)
      }
      throw Error("Le code est introuvable")
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async save(body: any) {
    try {
      const data = SupplierSpecificField.fromBody(body)
      const code = this.matricule.generate()

      const match = {
        telephone: data.telephone,
      }

      const isExiste = await this.datasource.isExiste(match)
      if (isExiste) throw Error(`Le numéro téléphone existe déjà`)

      const bodyRequest = {
        ...data,
        code: code,
      }

      const result = await this.datasource.store(bodyRequest)
      return SupplierSpecificField.fields(result)
    } catch (error: any) {
      throw Error(error.message ?? "Erreur durant la création")
    }
  }

  async update(code: string, body: object) {
    try {
      const data = SupplierSpecificField.fromBody(body)

      const find = await this.datasource.filter({ email: data.email })
      const codeFind = find ? find.code : undefined
      if (codeFind != undefined && codeFind != code) {
        throw Error(`Le numéro téléphone existe déjà`)
      }

      const bodyRequest = {
        ...data,
        code: code,
      }

      const result = await this.datasource.update(code, bodyRequest)
      if (this.isValid(result)) {
        return SupplierSpecificField.fields(result)
      }

      throw Error("Le code est introuvable")
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async deleteOne(code: string) {
    try {
      const result = await this.datasource.deleteOne(code)

      if (result.deletedCount > 0) {
        return SupplierSpecificField.fields(result)
      }

      throw Error("Le code est introuvable")
    } catch (error: any) {
      throw Error(error.message)
    }
  }
}
