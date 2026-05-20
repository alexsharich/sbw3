import {Router} from "express";
import {authMiddleware} from "../../global-middleware/auth.middleware";
import {commentContentValidator} from "../../comments/validators/comment.validators";
import {CommentsController} from "../../comments/controllers/comments.controller";
import {container} from "../../composition-root";

const commentsController = container.get(CommentsController)
export const commentsRouter = Router()

commentsRouter.put('/:commentId', authMiddleware, ...commentContentValidator, commentsController.updateComment.bind(commentsController))
commentsRouter.delete('/:commnetId', authMiddleware, commentsController.deleteComment.bind(commentsController))
commentsRouter.get('/:id', commentsController.getComment.bind(commentsController))