import TypeProduct from "../../../../core/constant/type_product"
import { capitalizeFirstLetter } from "../../../../core/utils/capitalizeFirstLetter"
import { CategoryProductSpecificField } from "./CategoryProductSpecificField"

export class ProductSpecificField {
  static fromBody(objet: any) {
    return {
      type: objet.type,
      name: capitalizeFirstLetter(objet.name),
      price: objet.price,
      description: objet.description,
      price_variation:
        objet.type === TypeProduct.variable ? objet.price_variation : null,
      category_code: objet.category_code,
    }
  }

  static fields(objet: any) {
    return {
      code: objet.code,
      type: objet.type,
      name: objet.name,
      description: objet.description,
      price: objet.price,
      price_variation: objet.price_variation,
      category_code: objet.category_code,
    }
  }

  static fieldsWithJoin(objet: any) {
    return {
      code: objet.code,
      type: objet.type,
      name: objet.name,
      description: objet.description,
      price: objet.price,
      price_variation: objet.price_variation,
      category: CategoryProductSpecificField.fields(objet.category),
    }
  }
}
