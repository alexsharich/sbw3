import {Request, Response} from "express";
import {InputPostType} from "../../input-output-types/posts.type";
import {postsService} from "../services/posts.service";

export const updatePostController = async (req: Request<{ id: string }, any, InputPostType>, res: Response) => {

    const isPostUpdated = await postsService.updatePost({params: req.params.id, body: req.body})
    if (isPostUpdated) {
        res.status(204).send(isPostUpdated)
        return
    }
    res.sendStatus(404)
}