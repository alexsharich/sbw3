import {body} from "express-validator";
import {inputCheckErrorsMiddleware} from "../global-middleware/inputCheckErrorMiddleware";
import {blogsRepository} from "../repositories/blogs/blogs.repository";
import {NextFunction, Request, Response} from "express";
import {postsRepository} from "../repositories/posts/posts.repository";
import {adminMiddleware} from "../global-middleware/admin.middleware";

export const titleValidator = body('title').isString().withMessage('not string').isLength({
    min: 1,
    max: 30
}).withMessage('more than 30 or 0')
export const shortDescriptionValidator = body('shortDescription').isString().withMessage('not string').isLength({
    min: 1,
    max: 100
}).withMessage('more than 100 or 0')
export const contentValidator = body('content').isString().withMessage('not string').isLength({
    min: 1,
    max: 1000
}).withMessage('more than 1000 or 0')
export const blogIdValidator = body('blogId').isString().withMessage('not string').trim().custom(async (blogId: string) => {
    const blog = await blogsRepository.getById(+blogId)
    if (!blog) {
        throw new Error('blog not found')
        return true
    }
}).withMessage('no blog')
export const findPostValidator = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const post = await postsRepository.getById(+req.params.id)
    if (!post) {
        res.status(404).json({})
        return
    }
    next()
}

export const postsValidator = [
    adminMiddleware,
    titleValidator, shortDescriptionValidator, contentValidator, blogIdValidator,
    inputCheckErrorsMiddleware
]
