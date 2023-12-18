import { KeyLike, JWTPayload } from "jose"

export default class JwtJose {
  private issuer = "urn:api_anita"
  private audience = "urn:front_end"
  private jose: typeof import("jose")
  private algorithm = "ES256"

  constructor(jose: typeof import("jose")) {
    this.jose = jose
  }

  async sign(data: any): Promise<string> {
    const ecPublicKey = await this.getTokenKey()

    return new this.jose.SignJWT({ matricule: data })
      .setProtectedHeader({ alg: this.algorithm })
      .setIssuedAt()
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setExpirationTime(process.env.TOKEN_EXPIRE_AT as string)
      .sign(ecPublicKey)
  }

  async getTokenKey(): Promise<KeyLike> {
    return await this.jose.importPKCS8(pkcs8, this.algorithm)
  }

  async verifyJwt(token: string): Promise<JWTPayload> {
    try {
      return await this.getPayload(token)
    } catch (error) {
      throw Error("Error verify token")
    }
  }

  async getPayload(token: string): Promise<JWTPayload> {
    const ecPrivateKey = await this.getTokenKey()
    const { payload } = await this.jose.jwtVerify(token, ecPrivateKey, {
      issuer: this.issuer,
      audience: this.audience,
    })

    return payload
  }
}

const pkcs8 = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgiyvo0X+VQ0yIrOaN
nlrnUclopnvuuMfoc8HHly3505OhRANCAAQWUcdZ8uTSAsFuwtNy4KtsKqgeqYxg
l6kwL5D4N3pEGYGIDjV69Sw0zAt43480WqJv7HCL0mQnyqFmSrxj8jMa
-----END PRIVATE KEY-----`
