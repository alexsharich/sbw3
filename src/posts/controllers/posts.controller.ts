import {Request, Response} from "express";
import {InputCommentType} from "../../input-output-types/comments.type";
import {PostsQueryRepository} from "../repositories/posts.query.repository";
import {UsersQueryRepository} from "../../users/repositories/users.query.repository";
import {CommentsService} from "../../comments/services/commnets.service";
import {PostsService} from "../services/posts.service";
import {
    paginationQueries,
    paginationQueriesComment,
    PaginationQueriesCommentType,
    PaginationQueriesType
} from "../../helpers/pagination.values";
import {CommentsQueryRepository} from "../../comments/repositories/comments.query.repository";
import {InputPostType} from "../../input-output-types/posts.type";
import {inject, injectable} from "inversify";
import {
    blogsCollection,
    commentsCollection,
    devicesCollection,
    postsCollection,
    usersCollection
} from "../../repositories/db/db";

@injectable()
export class PostsController {
    constructor(@inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
                @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
                @inject(PostsService) private postsService: PostsService,
                @inject(CommentsQueryRepository) private commentsQueryRepository: CommentsQueryRepository,
                @inject(CommentsService) private commentsService: CommentsService) {
    }

    async createCommentForPost(req: Request<{
        id: string
    }, any, InputCommentType>, res: any) {
        const userId = req.userId
        const isPostExist = await this.postsQueryRepository.getById(req.params.id)
        if (!isPostExist) {
            res.sendStatus(404)
            return
        }
        if (userId) {
            const user = await this.usersQueryRepository.findUser(userId)
            if (user !== null) {
                const createdComment = await this.commentsService.createComment({
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

    async createPost(req: Request, res: Response) {

        const newPostCreated = await this.postsService.createPost(req.body)

        if (newPostCreated === null) {
            res.sendStatus(400)
            return
        }

        const newPost = await this.postsQueryRepository.getById(newPostCreated.toString())
        if (!newPost) {
            res.sendStatus(400)
            return
        }
        res.status(201).json(newPost)
    }

    async deletePost(req: Request, res: Response) {

        const isPostDeleted = await this.postsService.deletePost(req.params.id)

        if (!isPostDeleted) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }

    async findPost(req: Request, res: Response) {
        const foundPost = await this.postsQueryRepository.getById(req.params.id)
        if (!foundPost) {
            res.sendStatus(404)
            return;
        }
        res.status(200).json(foundPost)
    }

    async getCommentsForPost(req: Request<{
        id: string
    }, {}, {}, PaginationQueriesCommentType>, res: Response) {
        const postId = req.params.id
        const isPostExist = await this.postsQueryRepository.getById(postId)
        if (!isPostExist) {
            res.sendStatus(404)
            return
        }
        const sortFilter = paginationQueriesComment(req.query)
        const posts = await this.commentsQueryRepository.getComments(sortFilter, postId)
        if (posts) {
            res.status(200).json(posts)
            return
        }
    }

    async getPosts(req: Request<{}, {}, {}, PaginationQueriesType>, res: Response) {
        const sortFilter = paginationQueries(req.query)
        const posts = await this.postsQueryRepository.getAll(sortFilter)
        if (!posts) {
            res.sendStatus(404)
            return
        }
        res.status(200).json(posts)
    }
    async updatePost (req: Request<{ id: string }, any, InputPostType>, res: Response)  {

    const isPostUpdated = await this.postsService.updatePost({params: req.params.id, body: req.body})
    if (isPostUpdated) {
        res.status(204).send(isPostUpdated)
        return
    }
    res.sendStatus(404)
}

    async clearData(req: Request, res: Response) {
        await postsCollection.deleteMany({})
        await blogsCollection.deleteMany({})
        await usersCollection.drop()
        await commentsCollection.drop()
        await devicesCollection.drop()
        res.sendStatus(204)
    }

}