import JwtJose from "./JwtJose"
import * as jose from "jose"

export default class JwtAdapter {
  constructor(private implementation = new JwtJose(jose)) {}

  async generateAccessToken(jsonObject: object): Promise<string> {
    return await this.implementation.sign(jsonObject)
  }

  async verifyToken(token: string): Promise<jose.JWTPayload> {
    try {
      return await this.implementation.verifyJwt(token)
    } catch (error) {
      throw new Error("Token verification error")
    }
  }
}
