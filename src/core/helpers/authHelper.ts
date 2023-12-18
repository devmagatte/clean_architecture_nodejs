import { Request } from "express"
import JwtJose from "../config/jwt/JwtJose"
import * as jose from "jose"
import { DataToken } from "../middlewares/AuthMiddleware"

export class AuthHelper {
  static async getDataToken(req: Request): Promise<DataToken> {
    try {
      const jwt = new JwtJose(jose)
      const authHeader = req.headers.authorization
      if (!authHeader) throw Error("Unauthorized")

      const bearerToken = authHeader.split(" ")
      const bearer = `${bearerToken[0]}`

      if (bearer !== "Bearer") throw Error()

      const token = `${bearerToken[1]}`
      const data = await jwt.verifyJwt(token)

      const matricule = data?.matricule as DataToken

      return matricule
    } catch (error) {
      throw Error("Token incorrecte")
    }
  }
}
