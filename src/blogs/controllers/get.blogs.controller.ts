import {Request, Response} from "express";
import {blogsQueryRepository} from "../repositories/blogs.query.repository";
import {paginationQueries, PaginationQueriesType} from "../../helpers/pagination.values";

export const getBlogsController = async (req: Request<{}, {}, {}, PaginationQueriesType>, res: Response) => {
    const sortFilter = paginationQueries(req.query)
    const blogs = await blogsQueryRepository.getAll(sortFilter)
    if (blogs) {
        res.status(200).send(blogs)
    }
}