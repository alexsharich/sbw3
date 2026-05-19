import {body} from "express-validator";
import {inputCheckErrorsMiddleware} from "../../global-middleware/inputCheckErrorMiddleware";
import {emailValidator, loginValidator} from "../../users/middlewares/users.validator";
import {NextFunction, Request, Response} from "express";
import {InputUserType} from "../../input-output-types/users.type";
import {container} from "../../composition-root";
import {UsersQueryRepository} from "../../users/repositories/users.query.repository";

const usersQueryRepository = container.get(UsersQueryRepository)

export const emailOrLoginValidator = body('loginOrEmail').trim().notEmpty().isString()

export const passwordValidator = body('password').trim().notEmpty().isString()

export const newPasswordValidator = body('newPassword').trim().notEmpty().isString().isLength({
    min: 6,
    max: 20
}).withMessage('more then 20 or 5')

export const userIdValidator = body('userId').trim().notEmpty().isString()

export const codeResendingValidator = body('code').trim().notEmpty().isString().withMessage('invalid code')

export const isCreatedUserValidator = async (req: Request<any, any, InputUserType>, res: Response, next: NextFunction) => {
    const isCreatedUser = await usersQueryRepository.checkUniqUserWithEmailOrLogin(req.body.login, req.body.email)
    if (isCreatedUser) {
        const field = isCreatedUser.accountData.email === req.body.email ? 'email' : 'login'
        res
            .status(400)
            .json({errorsMessages: [{message: '123123', field: field}]})
        return
    }
    next()
}
export const registrationValidator = [
    loginValidator,
    emailValidator,
    passwordValidator,

    inputCheckErrorsMiddleware,
]

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
export const emailCodeResendingValidator = [
    codeResendingValidator,

    inputCheckErrorsMiddleware,
]