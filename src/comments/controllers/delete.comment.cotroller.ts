import {Request, Response} from "express";
import {commentsService} from "../services/commnets.service";

export const deleteCommentController = async (req: Request<{ commentId: string }>, res: Response) => {
    const userId = req.userId!
    const commentId = req.params.commentId
    const isCommnetDeleted = await commentsService.delete(userId, commentId)
    if (isCommnetDeleted === 'not found') {
        res.sendStatus(404)
    }
    if (isCommnetDeleted === 'forbidden') {
        res.sendStatus(403)
        return
    }
    res.sendStatus(204)
}