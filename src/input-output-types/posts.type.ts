import {HydratedDocument, model, Model, Schema} from "mongoose";

export type OutputPostType = {
    id: string,
    title: string,
    shortDescription: string,
    createdAt: string,
    content: string,
    blogId: string,
    blogName: string
}

export type InputPostType = {
    title: string // max 30
    shortDescription: string // max 100
    content: string // max 1000
    blogId: string // valid
}

export type InputPostForBlogType = {
    title: string // max 30
    shortDescription: string // max 100
    content: string // max 1000
}
export type PostDBType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string
    createdAt: string
}

export type PostModelType = Model<PostDBType>
export type PostDocument = HydratedDocument<PostDBType>

const PostSchema = new Schema<PostDBType>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true}
})

export const PostModel = model<PostDBType, PostModelType>('posts', PostSchema)