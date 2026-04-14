import {commentsCommandRepository} from "../repositories/comments.comand.repository";
import {postsService} from "../../posts/services/posts.service";
import {commentsQueryRepository} from "../repositories/comments.query.repository";
import {CommentType} from "../../input-output-types/comments.type";

export const commentsService = {
    async delete(userId: string, commentId: string) {
        const comment = await commentsCommandRepository.find(commentId)
        if (!comment) {
            return 'not found'
        }
        if (comment?.commentatorInfo.userId === userId) {
            return await commentsCommandRepository.delete(commentId)
        }
        return 'forbidden'
    },
    async updateComment(userId: string, commentId: string, content: string) {
        const comment = await commentsCommandRepository.find(commentId)
        console.log('COMMENT :', comment)
        if (!comment) {
            return 'not found'
        }
        if (comment.commentatorInfo.userId === userId) {
            return await commentsCommandRepository.update(commentId, content)
        }
        return 'forbidden'
    },
    async createComment({userId, userLogin, postId, comment}: any) {

        const existPost = await postsService.findPost(postId)
        if (existPost) {
            const newComment: CommentType = {
                postId,
                content: comment,
                commentatorInfo: {
                    userId,
                    userLogin
                },
                createdAt: (new Date().toISOString())
            }
            const createdCommentId = await commentsCommandRepository.createComment(newComment)
            if (createdCommentId) {
                return await commentsCommandRepository.find(createdCommentId)
            }
        }

    }
}