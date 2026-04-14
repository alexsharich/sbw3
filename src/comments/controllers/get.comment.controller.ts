import {Request, Response} from "express";
import {commentsQueryRepository} from "../repositories/comments.query.repository";

export const getCommentController = async (req: Request<{ id: string }>, res: Response) => {
    const comment = await commentsQueryRepository.find(req.params.id)
    if (!comment) {
        res.sendStatus(404)
        return
    }
    res.status(200).send(comment)
}