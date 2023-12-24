import * as path from "path"
import i18n from "i18n"

export default class ConfigI18n {
  locales: string[] = ["en", "fr"]
  defaultLocale: string = "en"
  relativePath: string = "../../../locales"
  currentDir: string = __dirname

  init(): void {
    const resolvedPath: string = path.resolve(
      this.currentDir,
      this.relativePath,
    )

    return i18n.configure({
      locales: this.locales,
      defaultLocale: this.defaultLocale,
      directory: resolvedPath,
    })
  }
}
