import {Router} from "express";
import {findPostValidator, postsValidator} from "../../validators/postsValidator";
import {adminMiddleware} from "../../global-middleware/admin.middleware";
import {getPostsController} from "../../controllers/posts/get.posts.controller";
import {createPostController} from "../../controllers/posts/create.post.controller";
import {updatePostController} from "../../controllers/posts/update.post.controller";
import {deletePostController} from "../../controllers/posts/delete.post.controller";
import {findPostController} from "../../controllers/posts/find.post.controller";

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