import {commentsService} from "../services/commnets.service";
import {Request,Response} from "express";
import {InputCommentType} from "../../input-output-types/comments.type";

export const updateCommentController = async (req:Request<{commentId:string}, {}, InputCommentType>,res:Response)=>{
    const userId = req.userId!
    const commentId = req.params.commentId
    const content = req.body.content


    const isСommentUpdated = await commentsService.updateComment(userId,commentId,content)
    if (isСommentUpdated === "not found") {
        res.sendStatus(404)
        return
    } if (isСommentUpdated === 'forbidden'){
        res.sendStatus(403)
        return
    }
    res.sendStatus(204)
}