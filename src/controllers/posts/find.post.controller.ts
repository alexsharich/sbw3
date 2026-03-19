import {Request, Response} from "express";
import {postsRepository} from "../../repositories/posts/posts.repository";

export const findPostController = (req: Request, res: Response) => {
    const id = +req.params.id
    const post = postsRepository.getById(id)
    if (!post) {
        res.status(404)
    }
    res.status(200).send(post)
}