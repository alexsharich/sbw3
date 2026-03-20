import {Request, Response} from "express";
import {postsRepository} from "../../repositories/posts/posts.repository";
import {paginationQueries, PaginationQueriesType} from "../../helpers/pagination.values";

export const getPostsController = async (req: Request<{}, {}, {}, PaginationQueriesType>, res: Response) => {
    const sortFilter = paginationQueries(req.query)
    const posts = await postsRepository.getAll(sortFilter)
    if (posts) {
        res.status(200).json(posts)
    }
}