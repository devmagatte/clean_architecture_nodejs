import { Express } from "express"
import { AUTH_ADMIN_V1_ROUTES } from "./authAdminRouteHandle"

const RouteAuth = (app: Express, baseUrl: string = "/api/v1/auth") => {
  app.use(`${baseUrl}`, AUTH_ADMIN_V1_ROUTES)
}

export { RouteAuth }
