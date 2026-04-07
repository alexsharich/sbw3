import {Request, Response} from "express";
import {postsService} from "../services/posts.service";
import {postsQueryRepository} from "../repositories/posts.query.repository";

export const createPostController = async (req: Request, res: Response) => {

    const newPostCreated = await postsService.createPost(req.body)

    if (newPostCreated === null) {
        res.sendStatus(400)
        return
    }

    const newPost = await postsQueryRepository.getById(newPostCreated.toString())
    if (!newPost) {
        res.sendStatus(400)
        return
    }
    res.status(201).json(newPost)
}
