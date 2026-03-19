import {Request, Response} from "express";
import {blogsRepository} from "../../repositories/blogs/blogs.repository";
import {paginationQueries, PaginationQueriesType} from "../../helpers/pagination.values";

export const getBlogsController = async (req: Request<{}, {}, {}, PaginationQueriesType>, res: Response) => {
    const sortFilter = paginationQueries(req.query)
    const blogs = await blogsRepository.getAll(sortFilter)
    if (blogs) {
        res.status(200).send(blogs)
    }
}