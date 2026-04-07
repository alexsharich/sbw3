import {blogsCommandRepository} from "../repositories/blogs.command.repository";
import {BlogDto} from "../../routes/blogs-router/blogs.router";
import {InputBlogType} from "../../input-output-types/blogs.type";

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
    }
}