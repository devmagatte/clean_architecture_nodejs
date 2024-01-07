import { Router, Request, Response } from "express"

import { MediasController } from "../controllers/MediaController"
import { MediasDatasource } from "../datasources/MediaDatatsource"
import { MediasRepository } from "../repositories/MediaRepository"
import { multerArray } from "../../../core/middlewares/MulterMiddleware"

const router = Router()
const datasource = new MediasDatasource()
const repository = new MediasRepository(datasource)
const controller = new MediasController(repository)

const multer = multerArray()

router.get("/all", (req: Request, res: Response) => {
  return controller.index(req, res)
})

router.put("/upload", multer, (req: Request, res: Response) => {
  return controller.store(req, res)
})

const MEDIAS_V1_ROUTES = router
export { MEDIAS_V1_ROUTES }
