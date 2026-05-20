import {InputPostType, PostDBType} from "../../input-output-types/posts.type";
import {BlogsQueryRepository} from "../../blogs/repositories/blogs.query.repository";
import {PostsCommandRepository} from "../repositories/posts.command.repository";
import {inject, injectable} from "inversify";

export type PostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string
}

@injectable()
export class PostsService  {
    constructor(@inject(PostsCommandRepository) private postsCommandRepository: PostsCommandRepository,
                @inject(BlogsQueryRepository) private blogsQueryRepository: BlogsQueryRepository){}
    async createPost(body: InputPostType) {
        const existBlog = await this.blogsQueryRepository.getById(body.blogId)
        if (existBlog) {
            const newPost: PostType = {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
                blogName: existBlog.name,
                createdAt: (new Date().toISOString())
            }
            return await this.postsCommandRepository.create(newPost)
        } else {
            return null
        }
    }
    async deletePost(id: string) {
        return await this.postsCommandRepository.delete(id)
    }
    async updatePost({params, body}: any) {
        return await this.postsCommandRepository.update({params, body})
    }
    async findPost(id: string): Promise<PostDBType | null> {
        return await this.postsCommandRepository.find(id)
    }
}