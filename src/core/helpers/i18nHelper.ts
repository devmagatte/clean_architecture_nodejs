import i18n from "i18n"
import { Request } from "express"

export default function translateText(textKey: string, req: Request): string {
  const locale: string = (req.headers.locale as string) ?? "en"
  return i18n.__({ phrase: textKey, locale })
}
