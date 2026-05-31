import {CommentsCommandRepository} from "../repositories/comments.comand.repository";
import {PostsService} from "../../posts/services/posts.service";
import {CommentDocument, CommentModel, CommentType, LikeStatus} from "../../input-output-types/comments.type";
import {inject, injectable} from "inversify";
import {CommentsQueryRepository} from "../repositories/comments.query.repository";

@injectable()
export class CommentsService {
    constructor(@inject(CommentsCommandRepository) private commentsCommandRepository: CommentsCommandRepository,
                @inject(CommentsQueryRepository) private commentsQueryRepository: CommentsQueryRepository,
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
    async updateLikeStatus(likeStatus: LikeStatus, commentId: string, userId: string) {
        return await this.commentsCommandRepository.updateLikeStatus(likeStatus, commentId, userId)
    }

    async createComment({userId, userLogin, postId, content}: any) {

        const existPost = await this.postsService.findPost(postId)
        if (existPost) {
            const newComment: CommentDocument = new CommentModel()
            newComment.commentatorInfo ={userId,userLogin}
            newComment.postId = existPost.id
            newComment.content = content
            const createdCommentId = await this.commentsCommandRepository.save(newComment)
            if (createdCommentId) {
                return await this.commentsQueryRepository.findComment(createdCommentId,userId)
            }
        }
    }
}