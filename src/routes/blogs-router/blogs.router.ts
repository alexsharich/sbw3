import {Router} from "express";
import {blogValidator, findBlogValidator} from "../../blogs/validators/blogsValidator";
import {adminMiddleware} from "../../global-middleware/admin.middleware";
import {createBlogController} from "../../blogs/controllers/create.blog.controller";
import {updateBlogController} from "../../blogs/controllers/update.blog.controller";
import {deleteBlogController} from "../../blogs/controllers/delete.blog.controller";
import {getBlogsController} from "../../blogs/controllers/get.blogs.controller";
import {findBlogController} from "../../blogs/controllers/find.blog.controller";
import {getPostsForSelectedBlogController} from "../../blogs/controllers/get.posts.for.selected.blog.controller";
import {createPostForSelectedBlogController} from "../../blogs/controllers/create.post.for.selected.blog";
import {postForBlogValidator} from "../../posts/validators/postsValidator";

export const blogsRouter = Router({})

export type BlogDto = {
    name: string,
    description: string,
    websiteUrl: string
}

blogsRouter.get('/', getBlogsController)
blogsRouter.post('/', ...blogValidator, createBlogController)
blogsRouter.get('/:id/posts', getPostsForSelectedBlogController)
blogsRouter.post('/:id/posts', findBlogValidator, ...postForBlogValidator, createPostForSelectedBlogController)
blogsRouter.get('/:id', findBlogValidator, findBlogController)
blogsRouter.put('/:id', findBlogValidator, ...blogValidator, updateBlogController)
blogsRouter.delete('/:id', adminMiddleware, findBlogValidator, deleteBlogController)
