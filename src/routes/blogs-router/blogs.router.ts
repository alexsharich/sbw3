import {Router} from "express";
import {Response, Request} from 'express'
import {blogsRepository} from "../../repositories/blogs/blogs.repository";
import {blogValidator, findBlogValidator} from "../../validators/blogsValidator";
import {adminMiddleware} from "../../global-middleware/admin.middleware";

export const blogsRouter = Router({})

export type BlogDto = {
    name: string,
    description: string,
    websiteUrl: string
}

blogsRouter.get('/', (req: Request, res: Response) => {
    const blogs = blogsRepository.getAll()
    res.status(200).send(blogs)
})
blogsRouter.post('/', ...blogValidator, (req: Request, res: Response) => {//add 400
    const newBlog = {
        id: new Date().getTime(),
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    }
    const blogId = blogsRepository.create(newBlog)
    if (!blogId) {
        res.send(400)
    }
    const blog = blogsRepository.getById(blogId)
    if (!blog) {
        res.send(400)
    }
    res.status(201).send(blog)
}) // 404 swagger not exist
blogsRouter.get('/:id', findBlogValidator, (req: Request, res: Response) => {
    const id = +req.params.id
    const blog = blogsRepository.getById(id)
    if (!blog) {
        res.send(404)
    }
    res.status(200).send(blog)
})
blogsRouter.put('/:id', findBlogValidator, ...blogValidator, (req: Request, res: Response) => {//add 400
    const id = +req.params.id
    const body: BlogDto = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    }
    const blog = blogsRepository.getById(id)
    if (!blog) {
        res.status(404)
    }
    blogsRepository.update(id, body)
    res.send(204)
})
blogsRouter.delete('/:id', adminMiddleware, findBlogValidator, (req: Request, res: Response) => {
    const id = +req.params.id
    const isDeleted = blogsRepository.delete(id)
    if (!isDeleted) {
        res.status(404)
    }
    res.send(204)
})
