import BcryptImplement from "../../../core/config/bcrypt"
import JwtAdapter from "../../../core/config/jwt/jwt.adapter"
import MailTemplateName from "../../../core/constant/mail_template_name"
import DateUtils from "../../../core/utils/DateUtils"
import MatriculeGenerate from "../../../core/utils/MatriculeGenerate"
import VerifyField from "../../../core/utils/VerifyField"
import Mailling, { ParamsMailling } from "../../../services/mailing/mailling"
import { UserDatasource } from "../../user/datasources/UserDatasource"
import { UserSpecificField } from "../../user/helpers/specific_field/UserSpecificField"
import TokenSpecificField from "../helpers/specific_field/TokenSpecificField"

export class AuthAdminRepository extends VerifyField {
  private bcrypt = new BcryptImplement()
  private matricule = new MatriculeGenerate()
  private tokenAdapter = new JwtAdapter()

  constructor(private datasource = new UserDatasource()) {
    super()
  }
  async signIn(objet: any) {
    try {
      const match: object = {
        email: objet.email,
      }
      const user = await this.datasource.findOne(match)
      if (this.isValid(user)) {
        const isMatch = this.bcrypt.compare(objet.password, user.password)
        if (isMatch) {
          const response = {
            access_token: "",
            token_type: "",
          }

          const dataToken = {
            user_code: user.code,
            user_type: user.code_user_type,
          }

          response.access_token =
            await this.tokenAdapter.generateAccessToken(dataToken)

          response.token_type = "Bearer"

          const body = { token: response.access_token }

          this.datasource.update(user.code, body)
          return response
        }
        throw Error("Incorrect username or password")
      }
      throw Error("ID is invalid")
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async updateProfil(code: string, objet: any) {
    try {
      const matriculeExist = await this.datasource.findOneByCode(code)
      if (this.isValid(matriculeExist)) {
        const data = UserSpecificField.fromBody(objet)

        const matchEmail = {
          email: data.email,
        }
        const isEmailExist = await this.datasource.findOne(matchEmail)
        if (isEmailExist) {
          if (matriculeExist.email !== isEmailExist.email) {
            throw Error(`L'email [${data.email}] existe déjà`)
          }
        }

        const customer = await this.datasource.update(code, data)
        return UserSpecificField.fields(customer)
      }
      throw Error("L'utilisateur est introuvable")
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async resetPasswordAndSendMailValidation(objet: any) {
    try {
      const match = {
        email: objet.email,
      }
      const admin = await this.datasource.findOne(match)
      if (!admin) throw Error(`Email introuvable`)

      const token = this.matricule.generate("", 5)

      const currentDate = new Date()
      const tokenexpireDate = new Date(
        currentDate.getTime() + 24 * 60 * 60 * 1000,
      )

      const bodyRequestUpdate = {
        token_identify: token,
        token_expire_at: tokenexpireDate,
      }

      await this.datasource.update(admin.code, bodyRequestUpdate)

      const mailling = new Mailling()
      const paramsMailling: ParamsMailling = {
        context: {
          code: token,
        },
        templateName: MailTemplateName.SendCodeForResetPassword,
        from: `${process.env.MAIL_SEEDER}`,
        to: objet.email,
        subject: "Code pour mettre à jour votre mot de passe",
      }
      await mailling.sendMail(paramsMailling)
      return token
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async verifyTokenValidation(objet: any) {
    try {
      const bodyRequest = TokenSpecificField.fromBodyVerifyToken(objet)
      const admin = await this.datasource.findOne(bodyRequest)

      const tokenExpireAt = admin?.token_expire_at || undefined
      if (!tokenExpireAt) throw Error("Token est incorrecte")

      const tokenExpireDate: Date = new Date(tokenExpireAt)

      this.veriFyIfTokenHasExpired(tokenExpireDate)

      return {
        token_register: bodyRequest.token_identify,
        token_expire_at: tokenExpireDate.toISOString(),
      }
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  async updatePasswordIsValidToken(objet: any) {
    try {
      const bodyRequest = UserSpecificField.fromBodyUpdatePassword(objet)
      const customer = await this.datasource.findOne({
        $and: [
          { token_identify: { $eq: bodyRequest.token_identify } },
          { token_expire_at: { $eq: bodyRequest.token_expire_at } },
        ],
      })

      const tokenExpireAt = customer?.token_expire_at || undefined
      const tokenRegister = customer?.token_identify || ""

      if (!tokenExpireAt || tokenRegister !== bodyRequest.token_identify)
        throw Error("Code a expiré")

      const tokenExpireDate: Date = new Date(tokenExpireAt)

      this.veriFyIfTokenHasExpired(tokenExpireDate)

      const code = customer?.code as string
      const password = objet?.password

      const passwordHash = this.bcrypt.hash(password)

      const bodyRequestUpdate = {
        password: passwordHash,
        token_identify: null,
        token_expire_at: null,
      }

      const result = await this.datasource.update(code, bodyRequestUpdate)
      return UserSpecificField.fields(result)
    } catch (error: any) {
      throw Error(error.message)
    }
  }

  veriFyIfTokenHasExpired(tokenExpireDate: Date): void {
    const curentDate: Date = new Date()

    const diffDay = DateUtils.dateDiff(tokenExpireDate, curentDate)
    if (diffDay.day != 0) throw Error("Le code a expiré")
  }
}
