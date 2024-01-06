import { Router, Request, Response } from "express"

import { CategoryProductController } from "../controllers/CategoryProductController"
import { CategoryProductDatasource } from "../datasources/CategoryProductDatasource"
import { CategoryProductRepository } from "../repositories/CategoryProductRepository"

const router = Router()
const datasource = new CategoryProductDatasource()
const repository = new CategoryProductRepository(datasource)
const controller = new CategoryProductController(repository)

router.get("/all", (req: Request, res: Response) => {
  return controller.index(req, res)
})

router.post("/create", (req: Request, res: Response) => {
  return controller.store(req, res)
})

router.get("/:code", (req: Request, res: Response) => {
  return controller.show(req, res)
})

router.put("/:code/update", (req: Request, res: Response) => {
  return controller.update(req, res)
})

router.delete("/:code/delete", (req: Request, res: Response) => {
  return controller.delete(req, res)
})

const CATEGORY_PRODUCT_V1_ROUTES = router
export { CATEGORY_PRODUCT_V1_ROUTES }
