import {Post} from "../../routes/posts-router/posts.router";
import {ObjectId, WithId} from "mongodb";
import {blogsCollection, postsCollection} from "../db/db";
import {PostType} from "../../services/posts.service";
import {OutputPostType, PostDBType} from "../../input-output-types/posts.type";
import {OutputBlogType} from "../../input-output-types/blogs.type";
import {PaginationQueriesType} from "../../helpers/pagination.values";
import {SortMongoType} from "../blogs/blogs.repository";


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

export const postsRepository = {
    async getAll(query: PaginationQueriesType) {
        try {
            const pageNumber = query.pageNumber
            const pageSize = query.pageSize
            const sortBy = query.sortBy
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1
            const searchNameTerm = query.searchNameTerm
            let filter = {}
            if (searchNameTerm) {
                filter = {$regex: searchNameTerm, $option: 'i'}
            }
            const sortFilter: SortMongoType = {[sortBy]: sortDirection} as SortMongoType
            const posts = await postsCollection
                .find(filter)
                .sort(sortFilter)
                .skip((pageNumber - 1) * pageSize)
                .limit(+pageSize)
                .toArray()

            const totalCount = await blogsCollection.countDocuments(filter)


            return {
                pagesCount: Math.ceil(totalCount / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: totalCount,
                items: posts.map((post: WithId<PostDBType>) => mapToOutputPost(post))
            }
        } catch (e) {

            console.log('Get posts for selected blog Error')
            return null
        }
    },
    async getById(id: string): Promise<PostDBType | null> {

        try {
            const postId = new ObjectId(id)
            const post = await postsCollection.findOne({_id: postId})
            if (post) return mapToOutputPost(post)
            return null
        } catch (e) {
            return null
        }
    },
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