import express from "express"
import passport from "passport"
import bodyParser from "body-parser"
import helmet from "helmet"

import settingCorsOption from "../core/config/cors"
import { configSession } from "../core/config/configSession"

import { RouteUser } from "../features/user/routes/RouteUser"
import { RouteAuth } from "../features/auth/routes/RouteAuth"

const app = express()

app.use(settingCorsOption)
app.use(helmet())
app.use("/", bodyParser.json({ limit: "250kb" }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(configSession)
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static("public"))

RouteUser(app)
RouteAuth(app)

export default app
