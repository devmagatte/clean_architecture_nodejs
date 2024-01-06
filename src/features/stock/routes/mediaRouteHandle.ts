import { Router, Request, Response } from "express"

import { MediasController } from "../controllers/MediaController"
import { MediasDatasource } from "../datasources/mediaDatasource"
import { MediasRepository } from "../repositories/mediaRepository"

const router = Router()
const datasource = new MediasDatasource()
const repository = new MediasRepository(datasource)
const controller = new MediasController(repository)

router.get("/all", (req: Request, res: Response) => {
  return controller.index(req, res)
})

router.get("/store", (req: Request, res: Response) => {
  return controller.store(req, res)
})

const MEDIA_V1_ROUTES = router
export { MEDIA_V1_ROUTES }
