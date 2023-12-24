import { Express } from "express"

import USER_TYPES_V1_ROUTES from "./UserTypeRouteHandle"
import USERS_V1_ROUTES from "./UserRouteHandle"

const RouteUser = (app: Express, baseUrl: string = "/api/v1/users") => {
  app.use(`${baseUrl}/types`, USER_TYPES_V1_ROUTES)
  app.use(`${baseUrl}`, USERS_V1_ROUTES)
}

export { RouteUser }
