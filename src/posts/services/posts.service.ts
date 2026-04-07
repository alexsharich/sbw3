import {InputPostType} from "../../input-output-types/posts.type";
import {blogsQueryRepository} from "../../blogs/repositories/blogs.query.repository";
import {postsCommandRepository} from "../repositories/posts.command.repository";

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
        const existBlog = await blogsQueryRepository.getById(body.blogId)
        if (existBlog) {
            const newPost: PostType = {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: existBlog.name,
                createdAt: (new Date().toISOString())
            }
            return await postsCommandRepository.create(newPost)
        } else {
            return null
        }
    },
    async deletePost(id: string) {
        return await postsCommandRepository.delete(id)
    },
    async updatePost({params, body}: any) {
        return await postsCommandRepository.update({params, body})
    }
}