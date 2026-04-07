import {Request, Response} from "express";
import {blogsQueryRepository} from "../repositories/blogs.query.repository";

export const findBlogController = async (req: Request, res: Response) => {
    const foundBlog = await blogsQueryRepository.getById(req.params.id)
    if (!foundBlog) {
        res.sendStatus(404)
        return
    }
    res.status(200).send(foundBlog)

}