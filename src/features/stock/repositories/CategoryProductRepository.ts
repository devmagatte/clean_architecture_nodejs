import { CategoryProductSpecificField } from "../helpers/specific_field/CategoryProductSpecificField"
import { CategoryProductDatasource } from "../datasources/CategoryProductDatasource"

import VerifyField from "../../../core/utils/VerifyField"
import IRepository from "../../../core/interfaces/InterfaceRepository"
import MatriculeGenerate from "../../../core/utils/MatriculeGenerate"
import SlugGen from "../../../core/utils/SlugGen"

export interface ICategoryProductRepository extends IRepository {}

export class CategoryProductRepository
  extends VerifyField
  implements ICategoryProductRepository
{
  private matricule = new MatriculeGenerate()
  private slug = new SlugGen()

  constructor(private datasource: CategoryProductDatasource) {
    super()
  }

  async getAll(page: number, limit: number) {
    try {
      const result = await this.datasource.findAll(page, limit)

      if (result.data.length !== 0) {
        const list = result.data.map((value: object) =>
          CategoryProductSpecificField.fields(value),
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
        return CategoryProductSpecificField.fields(result)
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
        return CategoryProductSpecificField.fields(result)
      }
      throw Error("Le code est introuvable")
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async save(body: any) {
    try {
      const data = CategoryProductSpecificField.fromBody(body)
      const code = this.matricule.generate()
      const slug = this.slug.generate(data.name)

      const match = {
        slug: slug,
      }

      if (this.isValid(data.categorie_parent_code)) {
        const category = await this.datasource.findOneByCode(
          data.categorie_parent_code,
        )
        if (!this.isValid(category)) throw Error("Catégorie Parent introuvable")
      }

      const isExiste = await this.datasource.isExiste(match)
      if (isExiste) throw Error(`Le nom existe déjà `)

      const bodyRequest = {
        ...data,
        code: code,
        slug: slug,
      }

      const result = await this.datasource.store(bodyRequest)
      return CategoryProductSpecificField.fields(result)
    } catch (error: any) {
      throw Error(error.message ?? "Erreur durant la création")
    }
  }

  async update(code: string, body: object) {
    try {
      const data = CategoryProductSpecificField.fromBody(body)

      const find = await this.datasource.filter({ name: data.name })
      const codeFind = find ? find.code : undefined
      if (codeFind != undefined && codeFind != code) {
        throw Error(`Le nom existe déjà `)
      }

      const slug = this.slug.generate(data.name)

      const bodyRequest = {
        ...data,
        code: code,
        slug: slug,
      }

      const result = await this.datasource.update(code, bodyRequest)
      if (this.isValid(result)) {
        return CategoryProductSpecificField.fields(result)
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
        return CategoryProductSpecificField.fields(result)
      }

      throw Error("Le code est introuvable")
    } catch (error: any) {
      throw Error(error.message)
    }
  }
}
