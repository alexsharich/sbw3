import {CommentsCommandRepository} from "../repositories/comments.comand.repository";
import {PostsService} from "../../posts/services/posts.service";
import {CommentType} from "../../input-output-types/comments.type";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsService {
    constructor(@inject(CommentsCommandRepository) private commentsCommandRepository: CommentsCommandRepository,
                @inject(PostsService) private postsService: PostsService) {

    }

    async delete(userId: string, commentId: string) {
        const comment = await this.commentsCommandRepository.find(commentId)
        if (!comment) {
            return 'not found'
        }
        if (comment?.commentatorInfo.userId === userId) {
            return await this.commentsCommandRepository.delete(commentId)
        }
        return 'forbidden'
    }

    async updateComment(userId: string, commentId: string, content: string) {
        const comment = await this.commentsCommandRepository.find(commentId)
        console.log('COMMENT :', comment)
        if (!comment) {
            return 'not found'
        }
        if (comment.commentatorInfo.userId === userId) {
            return await this.commentsCommandRepository.update(commentId, content)
        }
        return 'forbidden'
    }

    async createComment({userId, userLogin, postId, comment}: any) {

        const existPost = await this.postsService.findPost(postId)
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
            const createdCommentId = await this.commentsCommandRepository.createComment(newComment)
            if (createdCommentId) {
                return await this.commentsCommandRepository.find(createdCommentId)
            }
        }

    }
}