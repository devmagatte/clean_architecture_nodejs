import { Router, Request, Response } from "express"

import UserTypeController from "../controllers/UserTypeController"
import UserTypeDatasource from "../datasources/UserTypeDatasource"
import UserTypeRepository from "../repositories/UserTypeRepository"

const router = Router()
const datasource = new UserTypeDatasource()
const repository = new UserTypeRepository(datasource)
const controller = new UserTypeController(repository)

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

const USERS_V1_ROUTES = router
export default USERS_V1_ROUTES
