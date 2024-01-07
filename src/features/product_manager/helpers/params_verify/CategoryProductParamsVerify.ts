import VerifyField from "../../../../core/utils/VerifyField"

export class CategoryProductParamsVerify extends VerifyField {
  name(req_body: any): string | null {
    if (this.isValid(req_body.name)) {
      if (this.isString(req_body.name)) {
        return null
      }
      return "Le nom doit être une chaine de caractère"
    }
    return "Le nom est requis"
  }

  categorieParentCode(req_body: any): string | null {
    if (this.isValid(req_body.categorie_parent_code)) {
      if (this.isString(req_body.categorie_parent_code)) {
        return null
      }
      return "The name doit être une chaine de caractère"
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
    result = this.categorieParentCode(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }

    return MESSAGE_ERROR
  }
}
