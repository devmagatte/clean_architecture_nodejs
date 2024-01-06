import { capitalizeFirstLetter } from "../../../../core/utils/capitalizeFirstLetter"

export class CategoryProductSpecificField {
  static fromBody(objet: any) {
    return {
      name: capitalizeFirstLetter(objet.name),
      categorie_parent_code: objet.categorie_parent_code,
    }
  }

  static fields(objet: any) {
    const category = this.#parseCategory(objet)
    return {
      code: objet.code,
      name: objet.name,
      slug: objet.slug,
      ...category,
    }
  }

  static #parseCategory(objet: any) {
    return {
      sous_categorie: objet.categorie
        ? objet.categorie.map((value: any) =>
            CategoryProductSpecificField.fields(value),
          )
        : null,
    }
  }
}
