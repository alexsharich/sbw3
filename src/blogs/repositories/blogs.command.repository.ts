import {BlogDBType, BlogModel} from "../../input-output-types/blogs.type";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class BlogsCommandRepository {

    async create(dto: BlogDBType) {
        try {
            const createdBlog = await BlogModel.insertOne(dto)
            await createdBlog.save()
            return createdBlog._id.toHexString()
        } catch (e) {
            return null
        }
    }

    async updateBlog({params, body}: any) {
        try {
            const blogId = new ObjectId(params)
            const blog = await BlogModel.findById(blogId)
            if (!blog) {
                return null
            }
            blog.name = body.name
            blog.description = body.description
            blog.websiteUrl = body.websiteUrl
            await blog.save()
            return true

        } catch (e) {
            return null
        }
    }

    async deleteBlog(id: string) {
        try {
            const blogId = new ObjectId(id)
            const result = await BlogModel.deleteOne(blogId)
            if (result.deletedCount === 1) return true
            return false
        } catch (e) {
            return false
        }
    }

    async deleteAllBlogs() {
        try {
            await BlogModel.deleteMany({})
        } catch (e) {
            throw new Error('Delete...Something wrong')
        }

    }
}