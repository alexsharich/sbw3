import {Request, Response} from "express";
import {blogsRepository} from "../../repositories/blogs/blogs.repository";

export const deleteBlogController = (req: Request, res: Response) => {

    const isDeleted = blogsRepository.deleteBlog(req.params.id)
    if (!isDeleted) {
        res.status(404)
    }
    res.send(204)
}