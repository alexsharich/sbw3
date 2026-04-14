import {commentsCollection} from "../../repositories/db/db";
import {ObjectId} from "mongodb";
import {CommentType} from "../../input-output-types/comments.type";
import {mapToOutputComment} from "./comments.query.repository";

export const commentsCommandRepository = {
    async delete(id: string) {
        try {
            const commentId = new ObjectId(id)
            const result = await commentsCollection.deleteOne({_id: commentId})
            if (result.deletedCount === 1) return true
            return false
        } catch (e) {
            return false
        }
    },
    async update(commentId: string, content: string): Promise<any> {
        try {
            const id = new ObjectId(commentId)
            const result = await commentsCollection.updateOne({_id: id}, {
                $set: {
                    content: content,
                }
            })
            if (result.matchedCount === 1) return await commentsCollection.findOne({_id: id})
            return null
        } catch (e) {
            return null
        }
    },
    async find(id: string) {
        try {
            const commentId = new ObjectId(id)
            const comment = await commentsCollection.findOne({_id: commentId})
            if (comment) return mapToOutputComment(comment)
            return null
        } catch (e) {
            return null
        }
    },
    async createComment(newComment: CommentType): Promise<any> {
        try {
            const createdComment = await commentsCollection.insertOne(newComment)
            console.log('CREATED COMMENT : ', createdComment)
            return createdComment.insertedId.toHexString()
        } catch (error) {
            console.log('Create blog error : ', error)
            return null
        }
    },
}