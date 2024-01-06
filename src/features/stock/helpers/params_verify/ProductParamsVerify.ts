import TypeProduct from "../../../../core/constant/type_product"
import VerifyField from "../../../../core/utils/VerifyField"

export class ProductParamsVerify extends VerifyField {
  name(req_body: any): string | null {
    if (this.isValid(req_body.name)) {
      if (this.isString(req_body.name)) {
        return null
      }
      return "Le nom doit est une chaine de caratère"
    }
    return "Le nom est requis"
  }

  description(req_body: any): string | null {
    if (this.isValid(req_body.description)) {
      if (this.isString(req_body.description)) {
        return null
      }
      return "La description doit est une chaine de caratère"
    }
    return null
  }

  price(req_body: any): string | null {
    if (this.isValid(req_body.price)) {
      if (this.isNumber(req_body.price)) {
        return null
      }
      return "Le prix de base doit être un nombre"
    }
    return "Le prix de base est requis"
  }

  type(req_body: any): string | null {
    if (this.isValid(req_body.type)) {
      if (TypeProduct.values.includes(req_body.type)) {
        return null
      }
      return `Les types de produits valides: [${TypeProduct.values}]`
    }
    return "Le type de produits est requis"
  }

  category_code(req_body: any): string | null {
    if (this.isValid(req_body.category_code)) {
      if (this.isString(req_body.category_code)) {
        return null
      }
      return "Le type de produit doit être une chaine de caractère"
    }
    return ""
  }

  price_variation(req_body: any): string | null {
    if (req_body.type === TypeProduct.variable) {
      if (!this.isValid(req_body.price_variation)) {
        return "Les prix variable sont requis"
      }
      const { price_variation } = req_body

      for (let index = 0; index < price_variation.length; index += 1) {
        const key = price_variation[index]
        const count = index + 1
        if (!this.isString(key.name)) {
          return `Le nom de la variation ${count} doit être une chaine de caratère`
        }
        if (!this.isNumber(key.price)) {
          return `Le prix de la variation ${count} doit être un nombre`
        }
      }

      return null
    }
    return null
  }

  verifyAllParamsStore(body: any): Array<string> {
    const MESSAGE_ERROR = []
    let result = null

    result = this.name(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    result = this.price(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    result = this.type(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    result = this.price_variation(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    result = this.category_code(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    return MESSAGE_ERROR
  }
}
