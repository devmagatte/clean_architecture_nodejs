import * as nodemailer from "nodemailer"
import handlebars from "nodemailer-express-handlebars"
import * as path from "path"

import IMailling from "./interface_mailling"

export interface ParamsMailling {
  context: object
  templateName: string
  from: string
  to: string
  subject: string
}

const { info, error } = console

export default class Mailling implements IMailling {
  private pathTemplate = "./src/views/mailling/"

  async sendMail(paramsMailling: ParamsMailling): Promise<void> {
    try {
      const transporter = this.#getTranport()

      transporter.use(
        "compile",
        handlebars({
          viewEngine: {
            partialsDir: path.resolve(this.pathTemplate),
            defaultLayout: false,
          },
          viewPath: path.resolve(this.pathTemplate),
        }),
      )

      const mailOptions = {
        from: paramsMailling.from,
        to: paramsMailling.to,
        subject: paramsMailling.subject,
        template: paramsMailling.templateName,
        context: paramsMailling.context,
      }

      await transporter.sendMail(mailOptions)
    } catch (error: any) {
      error(`Error sending email: ${error.message}`)
    }
  }

  async verifyConfigEmailing(): Promise<void> {
    try {
      if (process.env.MAIL_HOST) {
        const transporter = this.#getTranport()

        const result = await transporter.verify()

        if (result) {
          error(`Configuration Mailling réussie`)
        } else {
          info("Erreur configuration Mailling")
        }
      } else {
        error(`Erreur configuration Mailling: No host`)
      }
    } catch (error: any) {
      error(`Erreur configuration Mailling: ${error.message}`)
    }
  }

  #getTranport() {
    const transporter = nodemailer.createTransport({
      debug: true,
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    })
    return transporter
  }
}
