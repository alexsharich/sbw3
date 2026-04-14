import {Request} from "express";
import {usersQueryRepository} from "../../users/repositories/users.query.repository";
import {commentsService} from "../../comments/services/commnets.service";
import {postsQueryRepository} from "../repositories/posts.query.repository";
import {InputCommentType} from "../../input-output-types/comments.type";

export const createCommentForPostContrloller = async (req: Request<{
    id: string
}, any, InputCommentType>, res: any) => {
    const userId = req.userId
    const isPostExist = await postsQueryRepository.getById(req.params.id)
    if(!isPostExist){
        res.sendStatus(404)
        return
    }
    if (userId) {
        const user = await usersQueryRepository.findUser(userId)
        if (user !== null) {
            const createdComment = await commentsService.createComment({
                userId: userId,
                userLogin: user.login,
                postId: req.params.id,
                comment: req.body.content
            })
            if (createdComment) {
                res.status(201).send(createdComment)
                return
            }
        }
    }
}