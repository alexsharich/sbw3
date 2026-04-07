import {Request, Response} from "express";
import {postsQueryRepository} from "../repositories/posts.query.repository";

export const findPostController = async (req: Request, res: Response) => {
    const foundPost = await postsQueryRepository.getById(req.params.id)
    if (!foundPost) {
        res.sendStatus(404)
        return;
    }
    res.status(200).json(foundPost)
}