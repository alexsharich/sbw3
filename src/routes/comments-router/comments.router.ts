import {Router} from "express";
import {authMiddleware} from "../../global-middleware/auth.middleware";
import {commentContentValidator} from "../../comments/validators/comment.validators";
import {CommentsController} from "../../comments/controllers/comments.controller";
import {container} from "../../composition-root";
import {checklikeValidator} from "../../posts/validators/postsValidator";
import {userIdentificationMiddleware} from "../../posts/validators/user.Identification.middleware";

const commentsController = container.get(CommentsController)
export const commentsRouter = Router()

commentsRouter.put('/:commentId/like-status', authMiddleware, ...checklikeValidator, commentsController.updateCommentLikeStatus.bind(commentsController))

commentsRouter.put('/:commentId', authMiddleware, ...commentContentValidator, commentsController.updateComment.bind(commentsController))
commentsRouter.delete('/:commnetId', authMiddleware, commentsController.deleteComment.bind(commentsController))
commentsRouter.get('/:id', userIdentificationMiddleware, commentsController.getComment.bind(commentsController))