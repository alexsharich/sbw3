import {Request, Response} from "express";
import {CommentsService} from "../services/commnets.service";
import {InputCommentType} from "../../input-output-types/comments.type";
import {CommentsQueryRepository} from "../repositories/comments.query.repository";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsController {
    constructor(@inject(CommentsService) private commentsService: CommentsService,
                @inject(CommentsQueryRepository) private commentsQueryRepository: CommentsQueryRepository){}
    async deleteComment (req: Request<{ commentId: string }>, res: Response) {
    const userId = req.userId!
    const commentId = req.params.commentId
    const isCommnetDeleted = await this.commentsService.delete(userId, commentId)
    if (isCommnetDeleted === 'not found') {
    res.sendStatus(404)
}
if (isCommnetDeleted === 'forbidden') {
    res.sendStatus(403)
    return
}
res.sendStatus(204)
}
    async getComment (req: Request<{ id: string }>, res: Response)  {
    const comment = await this.commentsQueryRepository.find(req.params.id)
    if (!comment) {
    res.sendStatus(404)
    return
}
res.status(200).send(comment)
}
    async updateComment (req:Request<{commentId:string}, {}, InputCommentType>,res:Response){
    const userId = req.userId!
    const commentId = req.params.commentId
    const content = req.body.content


    const isСommentUpdated = await this.commentsService.updateComment(userId,commentId,content)
    if (isСommentUpdated === "not found") {
    res.sendStatus(404)
    return
} if (isСommentUpdated === 'forbidden'){
    res.sendStatus(403)
    return
}
res.sendStatus(204)
}
}