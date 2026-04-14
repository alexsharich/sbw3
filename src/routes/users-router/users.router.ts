import {Router} from "express";
import {getUsersController} from "../../users/controllers/get.users.controller";
import {adminMiddleware} from "../../global-middleware/admin.middleware";
import {deleteUserController} from "../../users/controllers/delete.user.controller";
import {createUserController} from "../../users/controllers/create.user.controller";
import {usersValidator} from "../../users/middlewares/users.validator";

export const usersRouter = Router({})

usersRouter.get('/', getUsersController)
usersRouter.post('/', adminMiddleware, ...usersValidator, createUserController)
usersRouter.delete('/:id', adminMiddleware, deleteUserController)