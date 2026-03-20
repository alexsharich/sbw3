import {Request, Response} from "express";
import {postsRepository} from "../../repositories/posts/posts.repository";

export const findPostController = async (req: Request, res: Response) => {
    const foundPost = await postsRepository.getById(req.params.id)
    if (!foundPost) {
        res.sendStatus(404)
        return;
    }
    res.status(200).json(foundPost)
}