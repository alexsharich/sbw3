import {body} from "express-validator";
import {inputCheckErrorsMiddleware} from "../../global-middleware/inputCheckErrorMiddleware";
import {NextFunction,Request,Response} from "express";
import {blogsQueryRepository} from "../repositories/blogs.query.repository";
import {adminMiddleware} from "../../global-middleware/admin.middleware";

export const nameValidator = body('name').isString().withMessage('not string').isLength({
    min:1,
    max:15
}).withMessage('more 15 or 0')
export const descriptionValidator = body('description').isString().withMessage('not string').isLength({
    min:1,
    max:500
}).withMessage('more 500 or 0')
export const websiteUrlValidator = body('websiteUrl').isString().withMessage('not string').trim().isURL().withMessage('not url').isLength({
    min:1,
    max:100
}).withMessage('more 100 or 0')



export const findBlogValidator = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const blog = await blogsQueryRepository.getById(req.params.id)
    if (!blog) {
        res.status(404).json({})
        return
    }
    next()
}
export const blogValidator = [
    adminMiddleware,
    nameValidator,descriptionValidator,websiteUrlValidator,
    inputCheckErrorsMiddleware
]