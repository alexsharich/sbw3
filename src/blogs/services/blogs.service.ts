import {blogsCommandRepository} from "../repositories/blogs.command.repository";
import {BlogDto} from "../../routes/blogs-router/blogs.router";
import {InputBlogType} from "../../input-output-types/blogs.type";
import {blogsQueryRepository} from "../repositories/blogs.query.repository";
import {InputPostForBlogType} from "../../input-output-types/posts.type";
import {PostType} from "../../posts/services/posts.service";
import {postsCommandRepository} from "../../posts/repositories/posts.command.repository";

export const blogsService = {
    async createBlog(dto: InputBlogType) {
        const newBlog = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            isMembership: false,
            createdAt: (new Date().toISOString())
        }
        return await blogsCommandRepository.create(newBlog)
    },
    async updateBlog(dto: InputBlogType, id: string) {
        const body: BlogDto = {
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl
        }

        return await blogsCommandRepository.updateBlog({params: id, body})
    },
    async deleteBlog(id: string) {
        return await blogsCommandRepository.deleteBlog(id)
    },
    async createPostForSelectedBlog({blogId, body}: { blogId: string, body: InputPostForBlogType }) {
        const existBlog = await blogsQueryRepository.getById(blogId)
        if (existBlog) {
            const newPost: PostType = {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: blogId,
                blogName: existBlog.name,
                createdAt: (new Date().toISOString()),
            }
            return await postsCommandRepository.create(newPost)
        } else {
            return null
        }
    },
}