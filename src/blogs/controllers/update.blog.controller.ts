import {Request, Response} from "express";
import {blogsQueryRepository} from "../repositories/blogs.query.repository";
import {BlogDto} from "../../routes/blogs-router/blogs.router";
import {blogsCommandRepository} from "../repositories/blogs.command.repository";
import {blogsService} from "../services/blogs.service";

export const updateBlogController = async (req: Request, res: Response) => {//add 400

    await blogsService.updateBlog(req.body, req.params.id)

    const blog = blogsQueryRepository.getById(req.params.id)
    if (!blog) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
}