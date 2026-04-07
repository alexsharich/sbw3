import {Router} from "express";
import {findPostValidator, postsValidator} from "../../posts/validators/postsValidator";
import {adminMiddleware} from "../../global-middleware/admin.middleware";
import {getPostsController} from "../../posts/controllers/get.posts.controller";
import {createPostController} from "../../posts/controllers/create.post.controller";
import {updatePostController} from "../../posts/controllers/update.post.controller";
import {deletePostController} from "../../posts/controllers/delete.post.controller";
import {findPostController} from "../../posts/controllers/find.post.controller";

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

postsRouter.get('/', getPostsController)
postsRouter.post('/', ...postsValidator, createPostController)
postsRouter.get('/:id', findPostValidator, findPostController)
postsRouter.put('/:id', adminMiddleware, ...postsValidator, updatePostController)
postsRouter.delete('/:id', adminMiddleware, findPostValidator, deletePostController)