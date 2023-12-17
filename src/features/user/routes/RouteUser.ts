import { Express } from "express"

import USER_TYPES_V1_ROUTES from "./UserTypeRouteHandle"

const RouteUser = (app: Express, baseUrl: string = "/api/v1/user") => {
  app.use(`${baseUrl}/type`, USER_TYPES_V1_ROUTES)
}

export { RouteUser }
