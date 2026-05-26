import {HydratedDocument, model, Model, Schema} from "mongoose";
import {LikeStatus} from "./comments.type";

export type LikeType = {
    commentId: string
    userId: string
    myStatus: LikeStatus
}

export type LikeCommentModelType = Model<LikeType>
export type LikeCommentDocument = HydratedDocument<LikeType>

const LikeSchema = new Schema<LikeType>({
    commentId: {type: String, required: true},
    userId: {type: String, require: true},
    myStatus: {type: String, required: true}
})

export const LikeModel = model<LikeType, LikeCommentModelType>('commentLike', LikeSchema)