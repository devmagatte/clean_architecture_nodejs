import { capitalizeFirstLetter } from "../../../../core/utils/capitalizeFirstLetter"
import UserTypeSpecificField from "./UserTypeSpecificField"

export class UserSpecificField {
  static fromBody(objet: any) {
    return {
      first_name: capitalizeFirstLetter(objet.first_name),
      last_name: capitalizeFirstLetter(objet.last_name),
      email: objet.email,
      address: objet.address,
      code_user_type: objet.code_user_type,
    }
  }

  static fields(objet: any) {
    return {
      code: objet.code,
      first_name: objet.name,
      last_name: objet.name,
      email: objet.email,
      address: objet.address,
      status: objet.status,
    }
  }

  static fieldsWithJoin(objet: any) {
    return {
      code: objet.code,
      first_name: objet.name,
      last_name: objet.name,
      email: objet.email,
      address: objet.address,
      status: objet.status,
      role: UserTypeSpecificField.fields(objet.user_type),
    }
  }

  static fromBodyVerifyToken(objet: any) {
    return {
      token_identify: objet.token_register,
    }
  }

  static fromBodyUpdatePassword(objet: any) {
    return {
      token_identify: objet.token,
      token_expire_at: new Date(objet.token_expire_at),
    }
  }
}
