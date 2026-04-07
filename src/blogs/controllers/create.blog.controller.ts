import {Request, Response} from "express";
import {blogsRepository} from "../repositories/blogs.repository";

export const createBlogController = async (req: Request, res: Response) => {//add 400
    const newBlog = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl,
        isMembership: false,
        createdAt: (new Date().toISOString())
    }
    const isNewBlogCreated = await blogsRepository.create(newBlog)

    if (isNewBlogCreated) {
        const newBlog = await blogsRepository.getById(isNewBlogCreated)
        if (newBlog) {
            res.status(201).json(newBlog)
            return
        }
    }

    res.sendStatus(404)
}