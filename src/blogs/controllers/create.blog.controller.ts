import {Request, Response} from "express";
import {blogsQueryRepository} from "../repositories/blogs.query.repository";
import {blogsService} from "../services/blogs.service";

export const createBlogController = async (req: Request, res: Response) => {//add 400

    const isNewBlogCreated = await blogsService.createBlog(req.body)

    if (isNewBlogCreated) {

        const newBlog = await blogsQueryRepository.getById(isNewBlogCreated)
        if (newBlog) {
            res.status(201).json(newBlog)
            return
        }
    }
    res.sendStatus(404)
}