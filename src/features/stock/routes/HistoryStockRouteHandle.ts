import { Router, Request, Response } from "express"

import { HistoryStockController } from "../controllers/HistoryStockController"
import { HistoryStockDatasource } from "../datasources/HistoryStockDatasource"
import { HistoryStockRepository } from "../repositories/HistoryStockRepository"

const router = Router()
const datasource = new HistoryStockDatasource()
const repository = new HistoryStockRepository(datasource)
const controller = new HistoryStockController(repository)

router.get("/all", (req: Request, res: Response) => {
  return controller.index(req, res)
})

router.get("/:code", (req: Request, res: Response) => {
  return controller.show(req, res)
})

const HISTORY_STOCK_V1_ROUTES = router
export { HISTORY_STOCK_V1_ROUTES }
