import {Request, Response} from "express";
import {blogsService} from "../services/blogs.service";

export const deleteBlogController = async (req: Request, res: Response) => {

    const isDeleted = await blogsService.deleteBlog(req.params.id)

    if (!isDeleted) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
}