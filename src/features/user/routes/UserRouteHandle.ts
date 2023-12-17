import { Router, Request, Response } from "express"

import { UserController } from "../controllers/UserController"
import { UserDatasource } from "../datasources/UserDatasource"
import { UserRepository } from "../repositories/UserRepository"

const router = Router()
const datasource = new UserDatasource()
const repository = new UserRepository(datasource)
const controller = new UserController(repository)

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

router.put("/:code/status", (req: Request, res: Response) => {
  return controller.status(req, res)
})

router.delete("/:code/delete", (req: Request, res: Response) => {
  return controller.delete(req, res)
})

const USERS_V1_ROUTES = router
export default USERS_V1_ROUTES
