import { ProductSpecificField } from "../helpers/specific_field/ProductSpecificField"
import { ProductDatasource } from "../datasources/ProductDatasource"

import VerifyField from "../../../core/utils/VerifyField"
import IRepository from "../../../core/interfaces/InterfaceRepository"
import MatriculeGenerate from "../../../core/utils/MatriculeGenerate"
import SlugGen from "../../../core/utils/SlugGen"
import { CategoryProductDatasource } from "../datasources/CategoryProductDatasource"

export interface IProductRepository extends IRepository {}

export class ProductRepository
  extends VerifyField
  implements IProductRepository
{
  private matricule = new MatriculeGenerate()
  private slug = new SlugGen()
  private categoryProductDatasource = new CategoryProductDatasource()

  constructor(private datasource: ProductDatasource) {
    super()
  }

  async getAll(page: number, limit: number) {
    try {
      const result = await this.datasource.findAll(page, limit)

      if (result.data.length !== 0) {
        const list = result.data.map((value: object) =>
          ProductSpecificField.fieldsWithJoin(value),
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
        return ProductSpecificField.fieldsWithJoin(result)
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
        return ProductSpecificField.fieldsWithJoin(result)
      }
      throw Error("Le code est introuvable")
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async save(body: any) {
    try {
      const data = ProductSpecificField.fromBody(body)
      const code = this.matricule.generate()
      const slug = this.slug.generate(data.name)

      const priceVariation = data.price_variation?.map((value: any) => {
        return {
          code: this.matricule.generate(),
          name: value.name,
          price: value.price,
        }
      })

      data.price_variation = priceVariation

      const match = {
        slug: slug,
        category_code: data.category_code,
      }

      const isExiste = await this.datasource.isExiste(match)
      if (isExiste) throw Error(`Le produit existe déjà `)

      if (this.isValid(data.category_code)) {
        const matchCategory = {
          code: data.category_code,
        }
        const isCategoryProductExiste =
          await this.categoryProductDatasource.isExiste(matchCategory)

        if (!isCategoryProductExiste)
          throw Error(`Le type de produit existe pas `)
      }

      const bodyRequest = {
        ...data,
        code: code,
        slug: slug,
      }

      const result = await this.datasource.store(bodyRequest)
      return ProductSpecificField.fields(result)
    } catch (error: any) {
      throw Error(error)
    }
  }

  async update(code: string, body: object) {
    try {
      const data = ProductSpecificField.fromBody(body)
      const slug = this.slug.generate(data.name)

      const find = await this.datasource.filter({ slug: slug })
      const codeFind = find ? find.code : undefined
      if (codeFind != undefined && codeFind != code) {
        throw Error(`Le nom existe déjà `)
      }

      const bodyRequest = {
        ...data,
        code: code,
        slug: slug,
      }

      const result = await this.datasource.update(code, bodyRequest)
      if (this.isValid(result)) {
        return ProductSpecificField.fields(result)
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
        return null
      }

      throw Error("Le code est introuvable")
    } catch (error: any) {
      throw Error(error.message)
    }
  }
}
function CategoryData() {
  throw new Error("Function not implemented.")
}
