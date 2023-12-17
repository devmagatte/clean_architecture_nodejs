import VerifyField from "../../../../core/utils/VerifyField"

export default class UserTypeParamsVerify extends VerifyField {
  name(req_body: any): string | null {
    if (this.isValid(req_body.name)) {
      if (this.isString(req_body.name)) {
        return null
      }
      return "The name must be a string"
    }
    return "Name is required"
  }
}
