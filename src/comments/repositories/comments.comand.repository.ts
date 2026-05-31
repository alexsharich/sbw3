import {commentsCollection} from "../../repositories/db/db";
import {ObjectId} from "mongodb";
import {CommentDocument, CommentModel, LikeStatus} from "../../input-output-types/comments.type";
import {mapToOutputComment} from "./comments.query.repository";
import {injectable} from "inversify";
import {LikeModel} from "../../input-output-types/like.comment.type";

@injectable()
export class CommentsCommandRepository {
    async delete(id: string) {
        try {
            const commentId = new ObjectId(id)
            const result = await CommentModel.deleteOne({_id: commentId})
            if (result.deletedCount === 1) return true
            return false
        } catch (e) {
            return false
        }
    }

    async update(commentId: string, content: string): Promise<any> {
        try {
            const comment = await CommentModel.findById(commentId).exec()
            if (!comment) {
                return null
            }
            comment.content = content
            await comment.save()
            await CommentModel.findById(comment._id)
        } catch (e) {
            return null
        }
    }

    async find(id: string) {
        try {
            const commentId = new ObjectId(id)
            const comment = await CommentModel.findOne({_id: commentId})
            if (comment) return mapToOutputComment(comment)
            return null
        } catch (e) {
            return null
        }
    }

    async save(comment: CommentDocument) {
        await comment.save()
        return comment._id.toString()
    }

    async updateLikeStatus(status: LikeStatus, commentId: string, userId: string) {
        const comment = await CommentModel.findById(commentId).exec()
        if (!comment) {
            return false
        }

        const like = await LikeModel.findOne({commentId, userId}).exec()
        const userLikeStatus = comment.likeInfo
        console.log("likeeeeeeeeeeeeeee: ", like, status)
        console.log('USERID ::::: ', userId)
        if (!like) {
            if (status === 'None') {
                return
            }
            const newLike = new LikeModel({commentId, userId, myStatus: status})
            if (status === 'Like') {
                userLikeStatus.likeCount++
            }
            if (status === 'Dislike') {
                userLikeStatus.dislikeCount++
            }
            await newLike.save()
            await comment.save()
            return true
        }

        if (status === "Like") {
            if (like?.myStatus === "Dislike") {
                userLikeStatus.dislikeCount--
                userLikeStatus.likeCount++
            }
        }
        if (status === "Dislike") {

            if (like?.myStatus === "Like") {
                userLikeStatus.likeCount--
                userLikeStatus.dislikeCount++
            }
        }
        if (status === "None") {
            if (like?.myStatus === "Like") {
                userLikeStatus.likeCount--
            }
            if (like?.myStatus === "Dislike") {
                userLikeStatus.dislikeCount--
            }
        }


        like.myStatus = status
        await like.save()
        await comment.save()
        return true
    }

    async createComment(newComment: CommentDocument): Promise<any> {
        try {
            const createdComment = await commentsCollection.insertOne(newComment)
            console.log('CREATED COMMENT : ', createdComment)
            return createdComment.insertedId.toHexString()
        } catch (error) {
            console.log('Create blog error : ', error)
            return null
        }
    }
}