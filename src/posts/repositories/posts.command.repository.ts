import {Post} from "../../routes/posts-router/posts.router";
import {ObjectId, WithId} from "mongodb";
import {PostType} from "../services/posts.service";
import {OutputPostType, PostDBType, PostModel} from "../../input-output-types/posts.type";
import {OutputBlogType} from "../../input-output-types/blogs.type";
import {injectable} from "inversify";


const posts: Array<Post> = []

export const mapToOutputPost = (post: WithId<PostDBType>): OutputPostType => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        createdAt: post.createdAt,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName
    }
}
export type MapToOutputWithPagination = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": Array<OutputPostType> | Array<OutputBlogType>
}

@injectable()
export class PostsCommandRepository {

    async create(newPost: PostType) {

        const createdPost = await PostModel.insertOne(newPost)
        return createdPost.save()
        return createdPost._id.toString()
    }

    async delete(id: string) {
        try {
            const postId = new ObjectId(id)
            const result = await PostModel.deleteOne(postId)
            if (result.deletedCount === 1) return true
            return false
        } catch (e) {
            return false
        }
    }

    async deleteAllPosts() {
        try {
            await PostModel.deleteMany({})
        } catch (e) {
            throw new Error('Delete... Something wrong')
        }
    }

    async update({params, body}: any) {
        const postId = new ObjectId(params)
        const post = await PostModel.findById(postId).exec()
        if (!post) {
            return false
        }
        post.title = body.title
        post.content = body.content
        post.shortDescription = body.shortDescription
        post.blogId = body.blogId
        await post.save()

        return await PostModel.findById(postId).exec()
    }

    async find(id: string): Promise<OutputPostType | null> {
        const post = await PostModel.findById(id)
        if (!post) {
            return null
        }
        return mapToOutputPost(post)
    }
}