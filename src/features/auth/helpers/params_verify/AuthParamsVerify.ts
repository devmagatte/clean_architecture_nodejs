import { UserParamsVerify } from "../../../user/helpers/params_verify/UserParamsVerify"

export class AuthParamsVerify extends UserParamsVerify {
  token(reqBody: any) {
    if (this.isValid(reqBody.token)) {
      if (this.isString(reqBody.token)) {
        return null
      }
      return "The token is incorrect"
    }
    return "The token is required"
  }

  verifyIdentifiant(body: any) {
    const MESSAGE_ERROR = []
    let result = null

    result = this.email(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    result = this.password(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    return MESSAGE_ERROR
  }

  verifyParamsUpdatePassword(body: any) {
    const MESSAGE_ERROR = []
    let result = null

    result = this.token(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }

    result = this.password(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    return MESSAGE_ERROR
  }
}
