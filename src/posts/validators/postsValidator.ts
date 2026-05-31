import {body, param} from "express-validator";
import {inputCheckErrorsMiddleware} from "../../global-middleware/inputCheckErrorMiddleware";
import {NextFunction, Request, Response} from "express";
import {adminMiddleware} from "../../global-middleware/admin.middleware";
import {container} from "../../composition-root";
import {BlogsQueryRepository} from "../../blogs/repositories/blogs.query.repository";
import {PostsQueryRepository} from "../repositories/posts.query.repository";
import {LikeStatus} from "../../input-output-types/comments.type";

const blogsQueryRepository = container.get(BlogsQueryRepository)
const postsQueryRepository = container.get(PostsQueryRepository)

const validStatuses: LikeStatus[] = ['None', 'Like', 'Dislike'] as const;

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
    const blog = await blogsQueryRepository.getById(blogId)
    if (!blog) {
        throw new Error('blog not found')
        return true
    }
}).withMessage('no blog')
export const findPostValidator = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const post = await postsQueryRepository.getById(req.params.id)
    if (!post) {
        res.status(404).json({})
        return
    }
    next()
}
export const blogIdInParamsValidator = param('id').isString().withMessage('not string')
    .trim().custom(async (blogId: string) => {
        const blog = await blogsQueryRepository.getById(blogId)
        if (!blog) {
            throw new Error('blog not found !')
        }
        return true
    }).withMessage('no blog')

export const likeStatusValidator = body('likeStatus').isIn(validStatuses).isString().withMessage('incorrect status')
export const checklikeValidator = [
    likeStatusValidator,
    inputCheckErrorsMiddleware
]

export const postForBlogValidator = [
    adminMiddleware,

    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    blogIdInParamsValidator,

    inputCheckErrorsMiddleware,
]

export const postsValidator = [
    adminMiddleware,
    titleValidator, shortDescriptionValidator, contentValidator, blogIdValidator,
    inputCheckErrorsMiddleware
]
