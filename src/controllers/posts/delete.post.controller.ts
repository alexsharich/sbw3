import {Request, Response} from "express";
import {postsRepository} from "../../repositories/posts/posts.repository";

export const deletePostController =(req: Request, res: Response) => {
    const id = +req.params.id
    const isDeleted = postsRepository.delete(id)
    if (!isDeleted) {
        res.send(404)
    }
    res.send(204)
}