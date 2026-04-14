import {commentsCommandRepository} from "../repositories/comments.comand.repository";

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
}