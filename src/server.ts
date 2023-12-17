import app from "./app"
import ISeeder from "./core/interfaces/InterfaceSeeder"
import { SEEDERS } from "./seeders"

const { log } = console

const PORT = process.env.APP_PORT ?? 8000

const allSeeders: Array<ISeeder> = SEEDERS

const server = app.listen(PORT, async () => {
  if (allSeeders.length != 0) {
    allSeeders.forEach((value) => {
      value.seed().then((value) => {
        console.log(value)
      })
    })
  }
  log(`listening on PORT ${PORT}`)
})

export default server
