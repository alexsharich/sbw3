import {ObjectId} from "mongodb";
import {PaginationQueriesCommentType} from "../../helpers/pagination.values";
import {SortMongoType} from "../../blogs/repositories/blogs.query.repository";
import {
    CommentDocument,
    CommentModel,
    LikeStatus,
    OutputCommentType
} from "../../input-output-types/comments.type";
import {injectable} from "inversify";
import {LikeModel} from "../../input-output-types/like.comment.type";

export const mapToOutputComment = (comment: CommentDocument, myStatus: LikeStatus = 'None'): OutputCommentType => {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
        },
        likesInfo: {
            likesCount: comment.likeInfo.likeCount,
            dislikesCount: comment.likeInfo.dislikeCount,
            myStatus: myStatus || "None"
        },
        createdAt: comment.createdAt
    }
}

@injectable()
export class CommentsQueryRepository  {
    async findComment(id: string, userId: string) {
        try {
            const commentId = new ObjectId(id)
            const comment = await CommentModel.findOne({_id: commentId})
            const myStatus = await LikeModel.findOne({commentId, userId})

            if (comment) return mapToOutputComment(comment, myStatus?.myStatus)
            return null
        } catch (e) {
            return null
        }
    }
    async getComments(query: PaginationQueriesCommentType, postId: string, userId?: string) {
        try {
            const pageNumber = +query.pageNumber
            const pageSize = +query.pageSize
            const sortBy = query.sortBy
            const sortDirection = query.sortDirection === 'asc' ? 1 : -1
            let filter = {postId}

            const sortFilter: SortMongoType = {[sortBy]: sortDirection} as SortMongoType
            const comments = await CommentModel
                .find(filter)
                .sort(sortFilter)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .exec()

            const totalCount = await CommentModel.countDocuments(filter).exec()
            const myLikes = await LikeModel.find({userId: userId}).exec()

            return {
                pagesCount: Math.ceil(totalCount / query.pageSize),
                page: query.pageNumber,
                pageSize: query.pageSize,
                totalCount: totalCount,
                items: comments.map(comment => {
                    const likeStatus = myLikes?.find(like => like.commentId.toString() === comment._id.toString())

                    return mapToOutputComment(comment, likeStatus?.myStatus)
                })
            }
        } catch (e) {
            console.log('Get posts for selected blog Error', e)
            return null
        }
    }
}