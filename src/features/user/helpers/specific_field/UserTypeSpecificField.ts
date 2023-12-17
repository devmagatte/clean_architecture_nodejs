import { capitalizeFirstLetter } from "../../../../core/utils/capitalizeFirstLetter"

export default class UserTypeSpecificField {
  static fromBody(objet: any) {
    return {
      name: capitalizeFirstLetter(objet.name),
    }
  }

  static fields(objet: any) {
    return {
      code: objet.code,
      name: objet.name,
      slug: objet.slug,
    }
  }
}
