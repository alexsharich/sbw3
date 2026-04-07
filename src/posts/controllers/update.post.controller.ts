import {Request, Response} from "express";
import {postsRepository} from "../repositories/posts.repository";
import {InputPostType} from "../../input-output-types/posts.type";

export const updatePostController = async (req: Request<{ id: string }, any, InputPostType>, res: Response) => {
    const isPostUpdated = await postsRepository.update({params: req.params.id, body: req.body})
    if (isPostUpdated) {
        res.status(204).send(isPostUpdated)
        return
    }
    res.sendStatus(404)
}