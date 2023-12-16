import crypto from "crypto"

export default class MatriculeGenerate {
  public static CODELENGTH = 10
  generate(prefix?: string, length?: number) {
    const alpha = this.#alpha()
    const numeric = this.#numeric()

    const characters = alpha.concat(numeric)

    const code = this.#generadeCodeFromArray(
      characters,
      length ?? MatriculeGenerate.CODELENGTH,
    )

    if (prefix != null) {
      return `${prefix}${code}`
    }

    return code
  }

  #alpha() {
    return Array.from(Array(26), (_, index) => String.fromCharCode(65 + index))
  }
  #numeric() {
    return Array.from(Array(10), (_, index) => index.toString())
  }

  #generadeCodeFromArray(characters: string[], length: number) {
    return Array.from(Array(length), () => {
      const randomIndex = crypto.randomBytes(1)[0] % characters.length
      return characters[randomIndex]
    }).join("")
  }
}
