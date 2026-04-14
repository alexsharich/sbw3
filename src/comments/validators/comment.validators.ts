import {body} from 'express-validator'
import {inputCheckErrorsMiddleware} from "../../global-middleware/inputCheckErrorMiddleware";


export const contentForCommentValidator = body('content').isString().withMessage('not string')
    .trim().isLength({min: 20, max: 300}).withMessage('more then 300 or min 20')

export const commentContentValidator = [
    contentForCommentValidator,

    inputCheckErrorsMiddleware,
]