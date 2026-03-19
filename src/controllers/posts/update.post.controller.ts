import {Request, Response} from "express";
import {postsRepository} from "../../repositories/posts/posts.repository";

export const updatePostController = (req: Request, res: Response) => {
    const id = +req.params.id
    const isPostExist = postsRepository.getById(id)
    console.log('post exist ', isPostExist)
    if (!isPostExist) {
        res.send(404)
        return
    }
    const dto = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId
    }
    const isPostCreated = postsRepository.update(id, dto)
    console.log('isPost created', isPostCreated)
    if (!isPostCreated) {
        res.send(404)
        return
    }
    res.send(204)
}