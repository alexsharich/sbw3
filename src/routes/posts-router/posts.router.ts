import {Router} from "express";
import {findPostValidator, postsValidator} from "../../posts/validators/postsValidator";
import {adminMiddleware} from "../../global-middleware/admin.middleware";
import {authMiddleware} from "../../global-middleware/auth.middleware";

import {commentContentValidator} from "../../comments/validators/comment.validators";
import {PostsController} from "../../posts/controllers/posts.controller";
import {container} from "../../composition-root";
import {userIdentificationMiddleware} from "../../posts/validators/user.Identification.middleware";

export type PostDto = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
}
export type Post = {
    id: number
    title: string
    shortDescription: string
    content: string
    blogId: number | undefined
    blogName: string | undefined
}

const postsController = container.get(PostsController)
export const postsRouter = Router()

postsRouter.get('/:id/comments', userIdentificationMiddleware, postsController.getCommentsForPost.bind(postsController))
postsRouter.post('/:id/comments', authMiddleware, ...commentContentValidator, postsController.createCommentForPost.bind(postsController))

postsRouter.get('/', postsController.getPosts.bind(postsController))
postsRouter.post('/', ...postsValidator, postsController.createPost.bind(postsController))
postsRouter.get('/:id', findPostValidator, postsController.findPost.bind(postsController))
postsRouter.put('/:id', adminMiddleware, ...postsValidator, postsController.updatePost.bind(postsController))
postsRouter.delete('/:id', adminMiddleware, findPostValidator, postsController.deletePost.bind(postsController))