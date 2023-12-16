import app from "./app"

const { log } = console

const PORT = process.env.APP_PORT ?? 8000

const server = app.listen(PORT, async () => {
  log(`listening on PORT ${PORT}`)
})

export default server
