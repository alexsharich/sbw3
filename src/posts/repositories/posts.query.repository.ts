import {PaginationQueriesType} from "../../helpers/pagination.values";
import {SortMongoType} from "../../blogs/repositories/blogs.query.repository";
import {blogsCollection, postsCollection} from "../../repositories/db/db";
import {ObjectId, WithId} from "mongodb";
import {PostDBType} from "../../input-output-types/posts.type";
import {mapToOutputPost} from "./posts.command.repository";

export const postsQueryRepository = {
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
}