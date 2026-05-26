import {ObjectId, WithId} from "mongodb";
import {BlogDBType, BlogDocument, BlogModel, OutputBlogType} from "../../input-output-types/blogs.type";
import {injectable} from "inversify";

type Blog = {
    name: string,
    description: string,
    websiteUrl: string
}


export const mapToOutputBlog = (blog: WithId<BlogDBType>): OutputBlogType => {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
    }
}
export type SortMongoType = {
    [key: string]: 1 | -1
}

@injectable()
export class BlogsQueryRepository {
    async getAll(query: any) {
        try {
            const pageNumber = query.pageNumber
            const pageSize = query.pageSize
            const sortBy = query.sortBy
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1
            const searchNameTerm = query.searchNameTerm
            let filter = {}
            if (searchNameTerm) {
                filter = {name: {$regex: searchNameTerm, $options: 'i'}}
            }

            const sortFilter: SortMongoType = {[sortBy]: sortDirection} as SortMongoType

            const blogs = await BlogModel.find(filter)
                .sort(sortFilter)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
            const totalCount = await BlogModel.countDocuments(filter)
            return {
                pagesCount: Math.ceil(totalCount / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: totalCount,
                items: blogs.map((blog: BlogDocument) => mapToOutputBlog(blog))
            }
        } catch (e) {
            console.log('blogs query repo / get blogs : ', e)
            throw new Error('Blogs not found')
        }

    }

    async getById(id: string) {
        try {
            const blogId = new ObjectId(id)
            const blog = await BlogModel.findOne(blogId)
            if (blog) return mapToOutputBlog(blog)
            return null
        } catch (e) {
            console.log('Blog repository, find blog / find blog ', e)
            return null
        }
    }
}