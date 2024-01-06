import app from "./app"
import ISeeder from "./core/interfaces/InterfaceSeeder"
import { SEEDERS } from "./seeders"

const { log, info } = console

const PORT = process.env.APP_PORT ?? 8000

const allSeeders: Array<ISeeder> = SEEDERS

const server = app.listen(PORT, async () => {
  if (allSeeders.length != 0) {
    for (let index = 0; index < allSeeders.length; index++) {
      const data = allSeeders[index]
      const result = await data.seed()
      info(result)
    }
  }
  log(`listening on PORT ${PORT}`)
})

export default server
