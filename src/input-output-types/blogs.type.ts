import {HydratedDocument, model, Model, Schema} from "mongoose";

export type OutputBlogType = {
    id: string,
    name: string, // max 15
    description: string, // max 500
    websiteUrl: string, // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
    createdAt: string,
    isMembership: boolean
}

export type InputBlogType = {
    name: string, // max 15
    description: string, // max 500
    websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
}

export type BlogDBType = {
    name: string
    description: string
    websiteUrl: string
    isMembership: boolean
    createdAt: string
}

export type BlogModelType = Model<BlogDBType>
export type BlogDocument = HydratedDocument<BlogDBType>

const BlogSchema = new Schema<BlogDBType>({
    name: {type: String, requird: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    isMembership: {type: Boolean, required: true},
    createdAt: {type: String, required: true}
})

export const BlogModel = model<BlogDBType, BlogModelType>('blogs', BlogSchema)