import {Request, Response} from "express";
import {paginationQueries, PaginationQueriesType} from "../../helpers/pagination.values";
import {postsQueryRepository} from "../repositories/posts.query.repository";

export const getPostsController = async (req: Request<{}, {}, {}, PaginationQueriesType>, res: Response) => {
    const sortFilter = paginationQueries(req.query)
    const posts = await postsQueryRepository.getAll(sortFilter)
    if (!posts) {
        res.sendStatus(404)
        return
    }
    res.status(200).json(posts)
}