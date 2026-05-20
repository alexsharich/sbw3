import {Request, Response} from "express";
import {BlogsService} from "../services/blogs.service";
import {BlogsQueryRepository} from "../repositories/blogs.query.repository";
import {paginationQueries, PaginationQueriesType} from "../../helpers/pagination.values";
import {PostsQueryRepository} from "../../posts/repositories/posts.query.repository";
import {inject, injectable} from "inversify";
import {InputPostForBlogType} from "../../input-output-types/posts.type";
import {PostsService} from "../../posts/services/posts.service";

@injectable()
export class BlogsController {
    constructor(@inject(BlogsService) private blogsService: BlogsService,
                @inject(PostsService) private postsService: PostsService,
                @inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository,
                @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository) {

    }
    async createBlog (req: Request, res: Response) {

    const isNewBlogCreated = await this.blogsService.createBlog(req.body)

    if (isNewBlogCreated) {

        const newBlog = await this.blogsQueryRepository.getById(isNewBlogCreated)
        if (newBlog) {
            res.status(201).json(newBlog)
            return
        }
    }
    res.sendStatus(404)
}
    async createBlogForSelectedBlog (req: Request<{
        id: string
    }, {}, InputPostForBlogType>, res: Response) {
    const newPostCreated = await this.blogsService.createPostForSelectedBlog({blogId: req.params.id, body: req.body})
    if (newPostCreated === null) {
    res.sendStatus(407)
    return
}
const newPost = await this.postsService.findPost(newPostCreated)
if (!newPost) {
    res.sendStatus(406)
    return
}
res.status(201).json(newPost)
}
    async deleteBlog (req: Request, res: Response)  {

    const isDeleted = await this.blogsService.deleteBlog(req.params.id)

    if (!isDeleted) {
    res.sendStatus(404)
    return
}
res.sendStatus(204)
}
    async findBlog (req: Request, res: Response)  {
    const foundBlog = await this.blogsQueryRepository.getById(req.params.id)
    if (!foundBlog) {
    res.sendStatus(404)
    return
}
res.status(200).send(foundBlog)

}
    async getBlogs(req: Request<{}, {}, {}, PaginationQueriesType>, res: Response)  {
    const sortFilter = paginationQueries(req.query)
    const blogs = await this.blogsQueryRepository.getAll(sortFilter)
    if (blogs) {
        res.status(200).send(blogs)
    }
}
    async  getPostsForSelectedBlog(req: Request<{
        id: string
    }, {}, {}, PaginationQueriesType>, res: Response)  {

    const {pageNumber, pageSize, sortBy, sortDirection, searchNameTerm} = paginationQueries(req.query)
const blogId: string = req.params.id
const blog = await this.blogsQueryRepository.getById(blogId)
if (!blog) {
    res.sendStatus(404)
    return
}
const posts = await this.postsQueryRepository.getPostsForSelectedBlog({
    blogId,
    query: {pageSize, pageNumber, sortDirection, sortBy, searchNameTerm}
})


if (!posts) {
    res.sendStatus(404)
    return
}
res.status(200).send(posts)
}
    async updateBlog (req: Request, res: Response)  {

    await this.blogsService.updateBlog(req.body, req.params.id)

    const blog = this.blogsQueryRepository.getById(req.params.id)
    if (!blog) {
    res.sendStatus(404)
    return
}
res.sendStatus(204)
}
}