import { Router, Request, Response } from "express"

import { StockController } from "../controllers/StockController"
import { StockDatasource } from "../datasources/StockDatasource"
import { StockRepository } from "../repositories/StockRepository"

const router = Router()
const datasource = new StockDatasource()
const repository = new StockRepository(datasource)
const controller = new StockController(repository)

router.get("/all", (req: Request, res: Response) => {
  return controller.index(req, res)
})

router.post("/create", (req: Request, res: Response) => {
  return controller.store(req, res)
})

router.get("/:code", (req: Request, res: Response) => {
  return controller.show(req, res)
})

router.delete("/:code/delete", (req: Request, res: Response) => {
  return controller.delete(req, res)
})

const STOCK_V1_ROUTES = router
export { STOCK_V1_ROUTES }
