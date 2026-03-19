import {Router} from "express";
import {blogValidator, findBlogValidator} from "../../validators/blogsValidator";
import {adminMiddleware} from "../../global-middleware/admin.middleware";
import {createBlogController} from "../../controllers/blogs/create.blog.controller";
import {updateBlogController} from "../../controllers/blogs/update.blog.controller";
import {deleteBlogController} from "../../controllers/blogs/delete.blog.controller";
import {getBlogsController} from "../../controllers/blogs/get.blogs.controller";
import {findBlogController} from "../../controllers/blogs/find.blog.controller";

export const blogsRouter = Router({})

export type BlogDto = {
    name: string,
    description: string,
    websiteUrl: string
}

blogsRouter.get('/', getBlogsController)
blogsRouter.post('/', ...blogValidator, createBlogController)
blogsRouter.get('/:id', findBlogValidator, findBlogController)
blogsRouter.put('/:id', findBlogValidator, ...blogValidator, updateBlogController)
blogsRouter.delete('/:id', adminMiddleware, findBlogValidator, deleteBlogController)
