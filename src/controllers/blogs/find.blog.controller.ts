import {Request, Response} from "express";
import {blogsRepository} from "../../repositories/blogs/blogs.repository";

export const findBlogController = async (req: Request, res: Response) => {
    const foundBlog = await blogsRepository.getById(req.params.id)
    if (!foundBlog) {
        res.sendStatus(404)
        return
    }
    res.status(200).send(foundBlog)

}