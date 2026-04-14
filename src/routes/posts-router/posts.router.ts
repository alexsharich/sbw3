import {Router} from "express";
import {findPostValidator, postsValidator} from "../../posts/validators/postsValidator";
import {adminMiddleware} from "../../global-middleware/admin.middleware";
import {getPostsController} from "../../posts/controllers/get.posts.controller";
import {createPostController} from "../../posts/controllers/create.post.controller";
import {updatePostController} from "../../posts/controllers/update.post.controller";
import {deletePostController} from "../../posts/controllers/delete.post.controller";
import {findPostController} from "../../posts/controllers/find.post.controller";
import {getCommentsForPostController} from "../../posts/controllers/get.comments.for.post.controller";
import {authMiddleware} from "../../global-middleware/auth.middleware";
import {createCommentForPostContrloller} from "../../posts/controllers/create.comment.for.post";
import {commentContentValidator} from "../../comments/validators/comment.validators";

export const postsRouter = Router({})

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

postsRouter.get('/:id/comments', getCommentsForPostController)
postsRouter.post('/:id/comments', authMiddleware, ...commentContentValidator, createCommentForPostContrloller)//create comment for blog

postsRouter.get('/', getPostsController)
postsRouter.post('/', ...postsValidator, createPostController)
postsRouter.get('/:id', findPostValidator, findPostController)
postsRouter.put('/:id', adminMiddleware, ...postsValidator, updatePostController)
postsRouter.delete('/:id', adminMiddleware, findPostValidator, deletePostController)