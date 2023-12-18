import { Router, Request, Response, NextFunction } from "express"

import { AuthAdminController } from "../controllers/AuthAdminController"
import AuthMiddleware from "../../../core/middlewares/AuthMiddleware"

import { MongoBruteForcePrevent } from "../../../core/config/brute_force/mongoBruteForce"

const authMiddleware = new AuthMiddleware()

const authAdmin = (req: Request, res: Response, next: NextFunction) =>
  authMiddleware.authAdmin(req, res, next)

const router = Router()
const controller = new AuthAdminController()

const mongoBruteForcePrevent = new MongoBruteForcePrevent()

router.post("/signin/identifier", mongoBruteForcePrevent.prevent, (req, res) =>
  controller.signIn(req, res),
)

router.get("/me", authAdmin, (req, res) => controller.getProfil(req, res))

router.put("/me/update_profil", authAdmin, (req: Request, res: Response) =>
  controller.updateProfil(req, res),
)

router.post("/signin/forget_password", (req: Request, res: Response) =>
  controller.resetPassword(req, res),
)

router.post("/signin/verify_token", (req: Request, res: Response) =>
  controller.verifyToken(req, res),
)

router.put("/signin/update_password", (req: Request, res: Response) =>
  controller.updatePassword(req, res),
)

const AUTH_ADMIN_V1_ROUTES = router
export { AUTH_ADMIN_V1_ROUTES }
