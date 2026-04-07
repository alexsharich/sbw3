import {Request, Response} from "express";
import {postsService} from "../services/posts.service";

export const deletePostController = async (req: Request, res: Response) => {

    const isPostDeleted = await postsService.deletePost(req.params.id)

    if (!isPostDeleted) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
}