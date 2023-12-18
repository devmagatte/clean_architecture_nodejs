export default class TokenSpecificField {
  static fromBodyRegister(objet: any) {
    return {
      name: objet.name,
      email: objet.email,
    }
  }

  static fromBodyVerifyToken(objet: any) {
    return {
      token_identify: objet.token,
    }
  }

  static fromBodyUpdatePassword(objet: any) {
    return {
      token_identify: objet.token,
      token_expire_at: new Date(objet.token_expire_at),
    }
  }
}
