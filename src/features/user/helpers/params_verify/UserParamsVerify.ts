import VerifyField from "../../../../core/utils/VerifyField"

export class UserParamsVerify extends VerifyField {
  fistName(req_body: any) {
    if (this.isValid(req_body.first_name)) {
      if (this.isString(req_body.first_name)) {
        return null
      }
      return "Le prénom doit être une chaîne"
    }
    return "Le prénom est requis"
  }

  lastName(req_body: any) {
    if (this.isValid(req_body.last_name)) {
      if (this.isString(req_body.last_name)) {
        return null
      }
      return "Le nom doit être une chaîne"
    }
    return "Le nom est requis"
  }

  codeUserType(req_body: any) {
    if (this.isValid(req_body.code_user_type)) {
      if (this.isString(req_body.code_user_type)) {
        return null
      }
      return "Le code du type de l'utilisateur type doit être une chaîne"
    }
    return "Le code du type de l'utilisateur est requis"
  }

  email(req_body: any) {
    if (this.isValid(req_body.email)) {
      if (this.isEmail(req_body.email)) {
        return null
      }
      return "Email n'est pas valide"
    }
    return "Email est requis"
  }

  password(req_body: any) {
    if (this.isValid(req_body.password)) {
      if (this.isString(req_body.password)) {
        return null
      }
      return "Mot de passe doit être une chaîne"
    }
    return "Mot de passe est requis"
  }

  address(req_body: any) {
    if (this.isValid(req_body.address)) {
      if (this.isString(req_body.address)) {
        return null
      }
      return "L'adresse doit être une chaîne"
    }
    return "L'adresse est requis"
  }

  verifyAllParamsStore(body: any) {
    const MESSAGE_ERROR = []
    let result = null

    result = this.fistName(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    result = this.lastName(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    result = this.email(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    result = this.address(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    result = this.password(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    result = this.codeUserType(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    return MESSAGE_ERROR
  }

  verifyAllParamsUpdate(body: any) {
    const MESSAGE_ERROR = []
    let result = null

    result = this.fistName(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    result = this.lastName(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    result = this.email(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    result = this.address(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    result = this.codeUserType(body)
    if (result) {
      MESSAGE_ERROR.push(result)
    }
    return MESSAGE_ERROR
  }
}
