import { UserSpecificField } from "../../../user/helpers/specific_field/UserSpecificField"
import { ProductSpecificField } from "./ProductSpecificField"

export class HistoryStockSpecificField {
  static fields(objet: any) {
    return {
      id: objet._id,
      action: objet.action,
      date: objet.createdAt,
      quantity: objet.quantity,
      product: ProductSpecificField.fieldsWithJoin(objet.product),
      created_by: UserSpecificField.fields(objet.user),
    }
  }
}
