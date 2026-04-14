import {body} from "express-validator";
import {inputCheckErrorsMiddleware} from "../../global-middleware/inputCheckErrorMiddleware";
import {emailValidator, loginValidator} from "../../users/middlewares/users.validator";


export const emailOrLoginValidator = body('loginOrEmail').trim().notEmpty().isString()

export const passwordValidator = body('password').trim().notEmpty().isString()

export const userIdValidator = body('userId').trim().notEmpty().isString()

export const authValidator = [
    emailOrLoginValidator,
    passwordValidator,

    inputCheckErrorsMiddleware,
]

export const meValidator = [
    emailValidator,
    loginValidator,
    userIdValidator,
    inputCheckErrorsMiddleware,
]