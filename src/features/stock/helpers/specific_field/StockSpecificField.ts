import { ProductSpecificField } from "./ProductSpecificField"

export class StockSpecificField {
  static fromBody(objet: any) {
    return {
      stock_level: objet.number,
      code_product: objet.code_product,
    }
  }

  static fields(objet: any) {
    return {
      code: objet.code,
      stock_level: objet.stock_level,
      code_product: objet.code_product,
    }
  }
  static fieldsWithJoin(objet: any) {
    return {
      code: objet.code,
      stock_level: objet.stock_level,
      product: ProductSpecificField.fieldsWithJoin(objet.product),
    }
  }
}
