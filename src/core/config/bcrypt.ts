import bcrypt from "bcrypt"

export default class CryptData {
  private bcrypt: typeof import("bcrypt")

  constructor(params: typeof import("bcrypt") = bcrypt) {
    this.bcrypt = params
  }

  hash(string: string | Buffer, saltRounds = 10) {
    const salt = this.bcrypt.genSaltSync(saltRounds)
    return this.bcrypt.hashSync(string, salt)
  }

  compare(string: string | Buffer, stringHashed: string) {
    return this.bcrypt.compareSync(string, stringHashed)
  }
}
