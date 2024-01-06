import { Router, Request, Response } from "express"

import { ProductController } from "../controllers/ProductController"
import { ProductDatasource } from "../datasources/ProductDatasource"
import { ProductRepository } from "../repositories/ProductRepository"

const router = Router()
const datasource = new ProductDatasource()
const repository = new ProductRepository(datasource)
const controller = new ProductController(repository)

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

const PRODUCT_V1_ROUTES = router
export { PRODUCT_V1_ROUTES }
