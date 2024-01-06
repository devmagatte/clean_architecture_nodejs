import { ActionHistory } from "../../../../core/constant/ActionHistory"
import VerifyField from "../../../../core/utils/VerifyField"

export class StockParamsVerify extends VerifyField {
  number(req_body: any): string | null {
    if (this.isValid(req_body.number)) {
      if (this.isNumber(req_body.number)) {
        return null
      }
      return "Le nombre est invalide"
    }
    return "Le nombre est requis"
  }

  action(req_body: any): string | null {
    if (this.isValid(req_body.action)) {
      if (ActionHistory.values.includes(req_body.action)) {
        return null
      }
      return `Les action possible: ${ActionHistory.values.join(" - ")}`
    }
    return "L'action est requis"
  }

  code_product(req_body: any): string | null {
    if (this.isValid(req_body.code_product)) {
      if (this.isString(req_body.code_product)) {
        return null
      }
      return "Le code du produit doit être une chaine de caractère"
    }
    return "Le code du produit est requis"
  }

  verifyAllParamsStore(body: any): Array<string> {
    const MESSAGE_ERROR = []
    let result = null

    result = this.number(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    result = this.action(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    result = this.code_product(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    return MESSAGE_ERROR
  }
}
