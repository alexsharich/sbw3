import {Request, Response} from "express";
import {blogsRepository} from "../../repositories/blogs/blogs.repository";
import {BlogDto} from "../../routes/blogs-router/blogs.router";

export const updateBlogController = (req: Request, res: Response) => {//add 400

    const body: BlogDto = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    }
    const blog = blogsRepository.getById(req.params.id)
    if (!blog) {
        res.status(404)
    }
    blogsRepository.updateBlog({params:req.params.id, body})
    res.send(204)
}