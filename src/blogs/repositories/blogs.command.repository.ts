import {BlogDBType} from "../../input-output-types/blogs.type";
import {blogsCollection} from "../../repositories/db/db";
import {ObjectId} from "mongodb";

export const blogsCommandRepository = {

    async create(dto: BlogDBType) {
        const createdBlog = await blogsCollection.insertOne(dto)
        return createdBlog.insertedId.toString()

    },
    async updateBlog({params, body}: any) {
        try {
            const blogId = new ObjectId(params)

            const result = await blogsCollection.updateOne({_id: blogId}, {
                $set: {
                    name: body.name,
                    description: body.description,
                    websiteUrl: body.websiteUrl
                }
            })

            if (result.matchedCount === 1) return true
            return null

        } catch (e) {
            return null
        }
    },
    async deleteBlog(id: string) {
        try {
            const blogId = new ObjectId(id)
            const result = await blogsCollection.deleteOne({_id: blogId})
            if (result.deletedCount === 1) return true
            return false
        } catch (e) {
            return false
        }
    },
    async deleteAllBlogs() {
        try {
            await blogsCollection.deleteMany({})
        } catch (e) {
            throw new Error('Delete...Something wrong')
        }

    },
}