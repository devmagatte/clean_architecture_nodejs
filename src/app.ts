import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import swaggerJSDoc from "swagger-jsdoc"

import swaggerOptions from "./docs/swageer_config_option"

import { errorBodyHandler, errorUrlHandler } from "./core/utils/error_handle"

import MongoDb from "./services/database/mongoose/MongoDb"
import DbAdapter from "./services/database/db_adapter"

import app from "./routes/api_route_v1"

dotenv.config()

const urlMongo =
  process.env.APP_ENV !== "test"
    ? process.env.DB_URL_MONGO
    : process.env.DB_URL_MONGO_TEST

const database = new DbAdapter(new MongoDb(), urlMongo as string)

database.connectDatabase()

const specswagger = swaggerJSDoc(swaggerOptions)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specswagger))
app.set("view engine", "handlebars")

app.use(errorUrlHandler)
app.use(errorBodyHandler)

export default app
