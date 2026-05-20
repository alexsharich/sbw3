import {BlogDto} from "../../routes/blogs-router/blogs.router";
import {InputBlogType} from "../../input-output-types/blogs.type";
import {InputPostForBlogType} from "../../input-output-types/posts.type";
import {PostType} from "../../posts/services/posts.service";
import {inject, injectable} from "inversify";
import {BlogsQueryRepository} from "../repositories/blogs.query.repository";
import {PostsCommandRepository} from "../../posts/repositories/posts.command.repository";
import {BlogsCommandRepository} from "../repositories/blogs.command.repository";

@injectable()
export class BlogsService  {
    constructor(@inject(BlogsCommandRepository) private blogsCommandRepository: BlogsCommandRepository,
                @inject(PostsCommandRepository) private postsCommandRepository: PostsCommandRepository,
                @inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository) {

    }
    async createBlog(dto: InputBlogType) {
        const newBlog = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            isMembership: false,
            createdAt: (new Date().toISOString())
        }
        return await this.blogsCommandRepository.create(newBlog)
    }
    async updateBlog(dto: InputBlogType, id: string) {
        const body: BlogDto = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl
        }

        return await this.blogsCommandRepository.updateBlog({params: id, body})
    }
    async deleteBlog(id: string) {
        return await this.blogsCommandRepository.deleteBlog(id)
    }
    async createPostForSelectedBlog({blogId, body}: { blogId: string, body: InputPostForBlogType }) {
        const existBlog = await this.blogsQueryRepository.getById(blogId)
        if (existBlog) {
            const newPost: PostType = {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: blogId,
                blogName: existBlog.name,
                createdAt: (new Date().toISOString()),
            }
            return await this.postsCommandRepository.create(newPost)
        } else {
            return null
        }
    }
}