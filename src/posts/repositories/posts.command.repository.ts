import {Post} from "../../routes/posts-router/posts.router";
import {ObjectId, WithId} from "mongodb";
import {postsCollection} from "../../repositories/db/db";
import {PostType} from "../services/posts.service";
import {OutputPostType, PostDBType} from "../../input-output-types/posts.type";
import {OutputBlogType} from "../../input-output-types/blogs.type";


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

export const postsCommandRepository = {

    async create(newPost: PostType) {
        try {
            const createdPost = await postsCollection.insertOne(newPost)
            return createdPost.insertedId.toHexString()
        } catch (e) {
            console.log('Create post repo  erro', e)
            return null
        }
    },
    async delete(id: string) {
        try {
            const postId = new ObjectId(id)
            const result = await postsCollection.deleteOne({_id: postId})
            if (result.deletedCount === 1) return true
            return false
        } catch (e) {
            return false
        }
    },
    async deleteAllPosts() {
        try {
            await postsCollection.deleteMany({})
        } catch (e) {
            throw new Error('Delete... Something wrong')
        }
    },
    async update({params, body}: any) {
        try {
            const postId = new ObjectId(params)
            const result = await postsCollection.updateOne({_id: postId}, {
                $set: {
                    title: body.title,
                    content: body.content,
                    shortDescription: body.shortDescription,
                    blogId: body.blogId
                }
            })
            if (result.matchedCount === 1) return await postsCollection.findOne({_id: postId})
            return null
        } catch (e) {
            return null
        }
    }
}