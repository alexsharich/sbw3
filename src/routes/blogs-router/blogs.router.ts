import {Router} from "express";
import {blogValidator, findBlogValidator} from "../../blogs/validators/blogsValidator";
import {adminMiddleware} from "../../global-middleware/admin.middleware";
import {postForBlogValidator} from "../../posts/validators/postsValidator";
import {container} from "../../composition-root";
import {BlogsController} from "../../blogs/controllers/blogs.controller";


export type BlogDto = {
    name: string,
    description: string,
    websiteUrl: string
}

const blogsController = container.get(BlogsController)
export const blogsRouter = Router()

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))
blogsRouter.post('/', ...blogValidator, blogsController.createBlog.bind(blogsController))
blogsRouter.get('/:id/posts', blogsController.getPostsForSelectedBlog.bind(blogsController))
blogsRouter.post('/:id/posts', findBlogValidator, ...postForBlogValidator, blogsController.createPostForSelectedBlog.bind(blogsController))
blogsRouter.get('/:id', findBlogValidator, blogsController.findBlog.bind(blogsController))
blogsRouter.put('/:id', findBlogValidator, ...blogValidator, blogsController.updateBlog.bind(blogsController))
blogsRouter.delete('/:id', adminMiddleware, findBlogValidator, blogsController.deleteBlog.bind(blogsController))
