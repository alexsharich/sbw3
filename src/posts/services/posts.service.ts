import {InputPostType} from "../../input-output-types/posts.type";
import {blogsRepository} from "../../blogs/repositories/blogs.repository";
import {postsRepository} from "../repositories/posts.repository";

export type PostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

export const postsService = {
    async createPost(body: InputPostType) {
        const existBlog = await blogsRepository.getById(body.blogId)///к сервису или репе
        if (existBlog) {
            const newPost: PostType = {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: existBlog.name,
                createdAt: (new Date().toISOString())
            }
            return await postsRepository.create(newPost)
        } else {
            return null
        }
    }
}