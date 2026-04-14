import {Router} from "express";
import {getCommentController} from "../../comments/controllers/get.comment.controller";
import {deleteCommentController} from "../../comments/controllers/delete.comment.cotroller";
import {authMiddleware} from "../../global-middleware/auth.middleware";
import {commentContentValidator} from "../../comments/validators/comment.validators";
import {updateCommentController} from "../../comments/controllers/update.comment.controller";

export const commentsRouter = Router({})

commentsRouter.put('/:commentId', authMiddleware, ...commentContentValidator, updateCommentController)
commentsRouter.delete('/:commnetId', authMiddleware, deleteCommentController)
commentsRouter.get('/:id', getCommentController)