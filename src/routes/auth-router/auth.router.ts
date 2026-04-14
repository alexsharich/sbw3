import {Router} from "express";
import {loginController} from "../../auth/controllers/login.controller";
import {meController} from "../../auth/controllers/me.controller";
import {authValidator, meValidator} from "../../auth/middlewares/authValidator";
import {authMiddleware} from "../../global-middleware/auth.middleware";

export const authRouter = Router({})

authRouter.post('/login', authValidator, loginController)
authRouter.get('/me', meValidator, authMiddleware, meController)