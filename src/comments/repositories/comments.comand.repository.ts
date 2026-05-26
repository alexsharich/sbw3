import {commentsCollection} from "../../repositories/db/db";
import {ObjectId} from "mongodb";
import {CommentDocument, CommentModel, CommentType} from "../../input-output-types/comments.type";
import {mapToOutputComment} from "./comments.query.repository";
import {injectable} from "inversify";

@injectable()
export class CommentsCommandRepository  {
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
    async createComment(newComment: CommentType): Promise<any> {
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