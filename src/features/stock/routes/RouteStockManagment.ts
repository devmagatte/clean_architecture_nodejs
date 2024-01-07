import { Express } from "express"

import { CATEGORY_PRODUCT_V1_ROUTES } from "./ProductTypeRouteHandle"
import { PRODUCT_V1_ROUTES } from "./ProductRouteHandle"
// import { STOCK_V1_ROUTES } from "./StockRouteHandle"
import { MEDIAS_V1_ROUTES } from "./MediaRouteHandle"
// import { HISTORY_STOCK_V1_ROUTES } from "./HistoryStockRouteHandle"

const RouteStockManagment = (app: Express, baseUrl: string = "/api/v1") => {
  // app.use(`${baseUrl}/stocks`, STOCK_V1_ROUTES)
  // app.use(`${baseUrl}/stocks/histories`, HISTORY_STOCK_V1_ROUTES)
  // app.use(`${baseUrl}/suppliers`, SUPPLIER_V1_ROUTES)
  app.use(`${baseUrl}/medias`, MEDIAS_V1_ROUTES)
  app.use(`${baseUrl}/products`, PRODUCT_V1_ROUTES)
  app.use(`${baseUrl}/products/categories`, CATEGORY_PRODUCT_V1_ROUTES)
}

export { RouteStockManagment }
