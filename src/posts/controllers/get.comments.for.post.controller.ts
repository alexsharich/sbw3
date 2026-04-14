import {Request, Response} from "express";
import {postsQueryRepository} from "../repositories/posts.query.repository";
import {paginationQueriesComment, PaginationQueriesCommentType} from "../../helpers/pagination.values";
import {commentsQueryRepository} from "../../comments/repositories/comments.query.repository";


export const getCommentsForPostController = async (req: Request<{
    id: string
}, {}, {}, PaginationQueriesCommentType>, res: Response) => {
    const postId = req.params.id
    const isPostExist = await postsQueryRepository.getById(postId)
    if (!isPostExist) {
        res.sendStatus(404)
        return
    }
    const sortFilter = paginationQueriesComment(req.query)
    const posts = await commentsQueryRepository.getComments(sortFilter, postId)
    if (posts) {
        res.status(200).json(posts)
        return
    }
}