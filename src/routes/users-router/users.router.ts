import {Router} from "express";
import {adminMiddleware} from "../../global-middleware/admin.middleware";
import {usersValidator} from "../../users/middlewares/users.validator";
import {UsersController} from "../../users/controllers/users.controller";
import {container} from "../../composition-root";

const usersController = container.get(UsersController)
export const usersRouter = Router({})

usersRouter.get('/', usersController.getUsers.bind(usersController))
usersRouter.post('/', adminMiddleware, ...usersValidator, usersController.createUser.bind(usersController))
usersRouter.delete('/:id', adminMiddleware, usersController.deleteUser.bind(usersController))